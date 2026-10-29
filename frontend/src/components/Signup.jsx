import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import { signupStyles } from '../assets/dummyStyles';
import ThemeToggle from './ThemeToggle';

const API_BASE = "http://localhost:4000/api";

const Signup = ({ onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ask the server for the profile when signup only returned a token
  const fetchProfile = async (token) => {
    const res = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data?.user || res.data;
  };

  // save auth data (the rest of the app reads the token from localStorage)
  const persistAuth = (profile, token) => {
    try {
      if (token) localStorage.setItem("token", token);
      if (profile) localStorage.setItem("user", JSON.stringify(profile));

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }
    } catch (storageErr) {
      console.warn("Could not save auth data:", storageErr);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await axios.post(`${API_BASE}/users/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const token = res.data?.token;
      let profile = res.data?.user;

      if (!profile && token) {
        try {
          profile = await fetchProfile(token);
        } catch {
          profile = { name: name.trim(), email: email.trim() };
        }
      }

      persistAuth(profile, token);

      if (typeof onSignup === "function") {
        onSignup(profile, rememberMe, token);
      } else {
        navigate("/");
      }

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Signup error:", err?.response || err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ api: err.response.data.message });
      } else {
        setErrors({ api: err.message || "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={signupStyles.pageContainer}>
      {/* Top right theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className={signupStyles.cardContainer}>
        {/* header */}
        <div className={signupStyles.header}>
          <Link to="/login" className={signupStyles.backButton} aria-label="Back to login">
            <ArrowLeft size={20} />
          </Link>
          <div className={signupStyles.avatar}>
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className={signupStyles.headerTitle}>Create Account</h1>
          <p className={signupStyles.headerSubtitle}>
            Join TrackExpense and take control of your money
          </p>
        </div>

        {/* form */}
        <div className={signupStyles.formContainer}>
          {errors.api && <p className={signupStyles.apiError}>{errors.api}</p>}

          <form onSubmit={handleSubmit} noValidate>
            {/* name */}
            <div className="mb-5">
              <label htmlFor="name" className={signupStyles.label}>
                Full Name
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                  className={`${signupStyles.input} ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.name && (
                <p className={signupStyles.fieldError}>{errors.name}</p>
              )}
            </div>

            {/* email */}
            <div className="mb-5">
              <label htmlFor="email" className={signupStyles.label}>
                Email
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`${signupStyles.input} ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.email && (
                <p className={signupStyles.fieldError}>{errors.email}</p>
              )}
            </div>

            {/* password */}
            <div className="mb-5">
              <label htmlFor="password" className={signupStyles.label}>
                Password
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className={`${signupStyles.passwordInput} ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={signupStyles.passwordToggle}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className={signupStyles.fieldError}>{errors.password}</p>
              )}
            </div>

            {/* remember me */}
            <div className={signupStyles.checkboxContainer}>
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={signupStyles.checkbox}
              />
              <label htmlFor="remember" className={signupStyles.checkboxLabel}>
                Remember me
              </label>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`${signupStyles.button} ${
                isLoading ? signupStyles.buttonDisabled : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg className={signupStyles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* sign in link */}
          <div className={signupStyles.signInContainer}>
            <p className={signupStyles.signInText}>
              Already have an account?{" "}
              <Link to="/login" className={signupStyles.signInLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
