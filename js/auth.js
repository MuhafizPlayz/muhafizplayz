// Muhafız Playz — Authentication

async function loginUser(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email.trim(),
            password: password
        });

        if (error) {
            throw error;
        }

        return {
            success: true,
            user: data.user,
            session: data.session
        };

    } catch (error) {
        console.error("Login error:", error);

        return {
            success: false,
            error: error.message || "Login failed."
        };
    }
}


// Check whether the currently signed-in user is an admin
async function checkAdmin() {
    try {
        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();

        if (userError || !user) {
            return {
                isAdmin: false,
                user: null
            };
        }

        const { data: profile, error: profileError } = await supabaseClient
            .from("profiles")
            .select("id, email, role")
            .eq("id", user.id)
            .single();

        if (profileError || !profile || profile.role !== "admin") {
            return {
                isAdmin: false,
                user: user,
                profile: profile || null
            };
        }

        return {
            isAdmin: true,
            user: user,
            profile: profile
        };

    } catch (error) {
        console.error("Admin check error:", error);

        return {
            isAdmin: false,
            user: null
        };
    }
}


// Protect an admin page
async function requireAdmin() {
    const result = await checkAdmin();

    if (!result.isAdmin) {
        window.location.href = "../login.html";
        return false;
    }

    return true;
}


// Logout
async function logoutUser() {
    try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            throw error;
        }

        window.location.href = "../index.html";

    } catch (error) {
        console.error("Logout error:", error);
        alert("Logout failed: " + error.message);
    }
}


// Get current logged-in user
async function getCurrentUser() {
    try {
        const {
            data: { user },
            error
        } = await supabaseClient.auth.getUser();

        if (error) {
            console.error("Get user error:", error);
            return null;
        }

        return user;

    } catch (error) {
        console.error("Get user error:", error);
        return null;
    }
          }
