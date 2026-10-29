import React, { useRef, useState, useEffect } from 'react';
import { navbarStyles } from '../assets/dummyStyles';
import img1 from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User } from 'lucide-react';
import axios from 'axios';
import ThemeToggle from './ThemeToggle';

const BASE_URL = 'http://localhost:4000/api';

const Navbar = ({ user: propUser, onlogout }) => {
    const navigate = useNavigate();
    const menuRef = useRef();
    const [menuOpen, setMenuOpen] = useState(false);

    // user fetched from the server (used only when no user is passed as a prop)
    const [fetchedUser, setFetchedUser] = useState({
        name: "",
        email: "",
    });

    const user = propUser || fetchedUser;

    // fetch the user data from server
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    return;
                }
                const response = await axios.get(`${BASE_URL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const userData = response.data.user || response.data; // adjust based on your API response structure

                setFetchedUser(userData);
            } catch (error) {
                console.error("failed to load profile :", error);
            }
        };
        if (!propUser) {
            fetchUserData();
        }
    }, [propUser]);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        setMenuOpen(false);
        localStorage.removeItem("token");
        setFetchedUser({ name: "", email: "" });

        if (typeof onlogout === "function") {
            onlogout(); // App clears auth and navigates to /login
        } else {
            console.warn("onlogout prop was not passed to Navbar");
            navigate("/login"); // fallback
        }
    };

    // closes the toggle menu when the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className={navbarStyles.header}>
            <div className={navbarStyles.container}>
                {/* Logo and navigation links */}
                <div
                    onClick={() => navigate("/")}
                    className={navbarStyles.logoContainer}
                >
                    <div className={navbarStyles.logoImage}>
                        <img src={img1} alt="Logo" />
                    </div>
                    <span className={navbarStyles.logoText}>TrackExpense</span>
                </div>

                {/* Right side controls: theme toggle & user dropdown */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />

                    {/* if the user is present, show the user name and logout button */}
                    {user && (
                        <div className={navbarStyles.userContainer} ref={menuRef}>
                            <button onClick={toggleMenu} className={navbarStyles.userButton}>
                                <div className="relative">
                                    <div className={navbarStyles.userAvatar}>
                                        {user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div className={navbarStyles.statusIndicator}></div>
                                </div>
                                <div className={navbarStyles.userTextContainer}>
                                    <p className={navbarStyles.userName}>
                                        {user?.name || "User"}
                                    </p>
                                    <p className={navbarStyles.userEmail}>
                                        {user?.email || "user@trackexpense.com"}
                                    </p>
                                </div>

                                <ChevronDown className={navbarStyles.chevronIcon(menuOpen)} />
                            </button>

                            {/* dropdown menu */}
                            {menuOpen && (
                                <div className={navbarStyles.dropdownMenu}>
                                    <div className={navbarStyles.dropdownHeader}>
                                        <div className="flex items-center">
                                            <div className={navbarStyles.dropdownAvatar}>
                                                {user?.name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                            <div>
                                                <div className={navbarStyles.dropdownName}>
                                                    {user?.name || "User"}
                                                </div>
                                                <div className={navbarStyles.dropdownEmail}>
                                                    {user?.email || "user@trackexpense.com"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={navbarStyles.menuItemContainer}>
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                navigate("/profile");
                                            }}
                                            className={navbarStyles.menuItem}
                                        >
                                            <User className="w-4 h-4" />
                                            <span>My Profile</span>
                                        </button>
                                    </div>

                                    <div className={navbarStyles.menuItemBorder}>
                                        <button
                                            onClick={handleLogout}
                                            className={navbarStyles.logoutButton}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
