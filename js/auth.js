// Muhafız Playz — Admin authentication
// Uses the existing global `supabaseClient` defined in js/config.js.
// Does NOT depend on public.is_admin().

async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error || !data || !data.user) {
    return null;
  }
  return data.user;
}

async function checkAdmin() {
  const { data: userData, error: userError } = await supabaseClient.auth.getUser();

  if (userError || !userData || !userData.user) {
    return { isAdmin: false, user: null, profile: null };
  }

  const user = userData.user;

  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("id,email,role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Profile lookup failed:", profileError.message);
    return { isAdmin: false, user: user, profile: null, error: profileError.message };
  }

  if (profile && profile.role === "admin") {
    return {
      isAdmin: true,
      user: user,
      profile: profile
    };
  }

  return {
    isAdmin: false,
    user: user,
    profile: profile || null
  };
}

async function loginUser(email, password) {
  // 1. Sign in with Supabase Auth
  const { data: signInData, error: signInError } =
    await supabaseClient.auth.signInWithPassword({ email: email, password: password });

  if (signInError) {
    return { ok: false, error: signInError.message };
  }

  // 2. Get current session
  const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
  const session = sessionData ? sessionData.session : null;

  if (sessionError || !session || !session.user) {
    return { ok: false, error: "Login succeeded but no session was found. Please try again." };
  }

  // 3. Get authenticated user's ID
  const userId = session.user.id;

  // 4. Query that user's own profile
  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("id,email,role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    await supabaseClient.auth.signOut();
    return { ok: false, error: "Could not read your profile: " + profileError.message };
  }

  if (!profile) {
    await supabaseClient.auth.signOut();
    return { ok: false, error: "No profile record was found for this account." };
  }

  // 5. Check role
  if (profile.role !== "admin") {
    await supabaseClient.auth.signOut();
    return {
      ok: false,
      error: "You do not have administrator access. Your profile role is \"" + profile.role + "\"."
    };
  }

  return { ok: true, user: session.user, profile: profile };
}

async function requireAdmin() {
  const result = await checkAdmin();

  if (!result.isAdmin) {
    window.location.replace("../login.html");
    return false;
  }

  return true;
}

async function logoutUser() {
  await supabaseClient.auth.signOut();
  window.location.replace("../index.html");
}

window.loginUser = loginUser;
window.checkAdmin = checkAdmin;
window.requireAdmin = requireAdmin;
window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;
