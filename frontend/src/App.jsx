import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Profile from "./pages/Profile";
import Login from "./components/Login";
import Signup from "./components/Signup";

const API_URL = "http://localhost:4000";

// to protect the routes
const ProtectedRoutes = ({ user, children }) => {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const hasToken = localToken || sessionToken;

  if (!user || !hasToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// to scroll top when page reloads or new page is visited
const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // save auth data: localStorage if "remember me", otherwise sessionStorage
  const persistAuth = (userObj, tokenStr, remember = false) => {
    try {
      if (remember) {
        if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) localStorage.setItem("token", tokenStr);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      } else {
        if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) sessionStorage.setItem("token", tokenStr);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      setUser(userObj || null);
      setToken(tokenStr || null);
    } catch (err) {
      console.error("persistAuth error:", err);
    }
  };

  const clearAuth = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    } catch (error) {
      console.error("Error clearing auth:", error);
    }
    setUser(null);
    setToken(null);
  };

  // to update user data both in state and in storage
  const updateUserData = (updatedUser) => {
    setUser(updatedUser);

    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");

    if (localToken) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else if (sessionToken) {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const handleLogin = (userData, tokenValue, remember = true) => {
    // if the server sent no user object, use a placeholder so the route guard
    // lets us in, then fill in the real profile from /users/me
    persistAuth(userData || {}, tokenValue, remember);

    if (!userData && tokenValue) {
      axios
        .get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${tokenValue}` },
        })
        .then((res) => {
          const fresh = res.data?.user || res.data;
          if (fresh) updateUserData(fresh);
        })
        .catch((err) => console.warn("Could not load profile after login:", err));
    }
  };

  const handleSignup = (profile, rememberMe, tokenValue) => {
    persistAuth(profile, tokenValue, rememberMe);
    navigate("/");
  };

  // try to restore the session (user + token) when the app mounts
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const localUserRaw = localStorage.getItem("user");
        const sessionUserRaw = sessionStorage.getItem("user");
        const localToken = localStorage.getItem("token");
        const sessionToken = sessionStorage.getItem("token");

        const storedToken = localToken || sessionToken;
        const storedUserRaw = localUserRaw || sessionUserRaw;

        // no token means not logged in
        if (!storedToken) {
          setUser(null);
          setToken(null);
          return;
        }

        setToken(storedToken);

        // show the saved user immediately (if there is one)
        let storedUser = null;
        try {
          storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
        } catch {
          storedUser = null;
        }
        if (storedUser) setUser(storedUser);

        // then verify the token with the server and refresh the profile
        try {
          const res = await axios.get(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          const freshUser = res.data?.user || res.data;
          if (freshUser) updateUserData(freshUser);
        } catch (err) {
          const status = err.response?.status;
          if (status === 401 || status === 403) {
            // token is expired or invalid
            clearAuth();
          } else if (!storedUser) {
            // server unreachable and nothing saved to fall back on
            clearAuth();
          }
        }
      } catch (err) {
        console.error("Session restore error:", err);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />

        <Route
          element={
            <ProtectedRoutes user={user}>
              <Layout
                user={user}
                onlogout={handleLogout}
                onUserUpdate={updateUserData}
              />
            </ProtectedRoutes>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* any unknown URL goes home (and home redirects to /login if logged out) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;