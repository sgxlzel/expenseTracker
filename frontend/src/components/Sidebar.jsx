import React, { useEffect } from 'react'
import { sidebarStyles, cn } from '../assets/dummyStyles';
import { ArrowDown, ArrowUp, HelpCircle, Home, LogOut, Menu, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const MENU_ITEMS = [
  { text: "Dashboard", path: "/", icon: <Home size={20} /> },
  { text: "Income", path: "/income", icon: <ArrowUp size={20} /> },
  { text: "Expenses", path: "/expense", icon: <ArrowDown size={20} /> },
  { text: "Profile", path: "/profile", icon: <User size={20} /> },
];

// Layout passes the props as `iscollapsed` / `setiscollapsed` (lowercase),
// so alias iscollapsed to isCollapsed for use below.
const Sidebar = ({ user, iscollapsed: isCollapsed, setiscollapsed, onlogout }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeHover, setActiveHover] = React.useState(null);

  const { name: username = "User", email: useremail = "user@example.com" } = user || {};
  const initial = username.charAt(0).toUpperCase() || "U";

  // lock body scroll while the mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto" };
  }, [mobileOpen]);

  // logout: let App clear its state and navigate; fall back if prop is missing
  const handleLogout = () => {
    setMobileOpen(false);
    if (typeof onlogout === "function") {
      onlogout();
    } else {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setiscollapsed(!isCollapsed);
  };

  // a single desktop menu item
  const renderMenuItem = ({ text, path, icon }) => {
    const isActive = pathname === path;
    return (
      <motion.li key={text} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to={path}
          className={cn(
            sidebarStyles.menuItem.base,
            isActive ? sidebarStyles.menuItem.active : sidebarStyles.menuItem.inactive,
            isCollapsed ? sidebarStyles.menuItem.collapsed : sidebarStyles.menuItem.expanded
          )}
          onMouseEnter={() => setActiveHover(text)}
          onMouseLeave={() => setActiveHover(null)}
        >
          <span className={isActive ? sidebarStyles.menuIcon.active : sidebarStyles.menuIcon.inactive}>
            {icon}
          </span>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {text}
            </motion.span>
          )}
          {activeHover === text && !isActive && !isCollapsed && (
            <span className={sidebarStyles.activeIndicator}></span>
          )}
        </Link>
      </motion.li>
    );
  };

  return (
    <>
      {/* ---------- DESKTOP SIDEBAR ---------- */}
      <motion.div
        className={sidebarStyles.sidebarContainer.base}
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className={sidebarStyles.sidebarInner.base}>
          <button onClick={toggleSidebar} className={sidebarStyles.toggleButton.base}>
            <motion.div
              initial={false}
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points={isCollapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"}></polyline>
              </svg>
            </motion.div>
          </button>

          {/* user info */}
          <div
            className={cn(
              sidebarStyles.userProfileContainer.base,
              isCollapsed
                ? sidebarStyles.userProfileContainer.collapsed
                : sidebarStyles.userProfileContainer.expanded
            )}
          >
            <div className="flex items-center">
              <div className={sidebarStyles.userInitials.base}>{initial}</div>
              {!isCollapsed && (
                <motion.div
                  className="ml-3 overflow-hidden"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-sm font-bold text-gray-800 truncate">{username}</h2>
                  <p className="text-xs text-gray-500 truncate">{useremail}</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* menu links */}
          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
            <ul className={sidebarStyles.menuList.base}>
              {MENU_ITEMS.map(renderMenuItem)}
            </ul>
          </div>

          {/* footer */}
          <div
            className={cn(
              sidebarStyles.footerContainer.base,
              isCollapsed
                ? sidebarStyles.footerContainer.collapsed
                : sidebarStyles.footerContainer.expanded
            )}
          >
            <a
              href="https://hexagondigitalservices.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                sidebarStyles.footerLink.base,
                isCollapsed && sidebarStyles.footerLink.collapsed
              )}
            >
              <HelpCircle size={20} className="text-gray-500" />
              {!isCollapsed && <span>Support</span>}
            </a>

            <button
              onClick={handleLogout}
              className={cn(
                sidebarStyles.logoutButton.base,
                isCollapsed && sidebarStyles.logoutButton.collapsed
              )}
            >
              <LogOut size={20} className="text-gray-500" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ---------- MOBILE MENU BUTTON ---------- */}
      <motion.button
        onClick={() => setMobileOpen((prev) => !prev)}
        className={sidebarStyles.mobileMenuButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* ---------- MOBILE SIDEBAR ---------- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={sidebarStyles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* clicking the dark backdrop closes the menu */}
            <motion.div
              className={sidebarStyles.mobileBackdrop}
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className={sidebarStyles.mobileSidebar.base}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="relative h-full flex flex-col">
                {/* header: user info + close button */}
                <div className={sidebarStyles.mobileHeader}>
                  <div className={sidebarStyles.mobileUserContainer}>
                    <div className={sidebarStyles.userInitials.base}>{initial}</div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{username}</h2>
                      <p className="text-sm text-gray-500">{useremail}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className={sidebarStyles.mobileCloseButton}
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>

                {/* menu links */}
                <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                  <ul className={sidebarStyles.mobileMenuList}>
                    {MENU_ITEMS.map(({ text, path, icon }) => (
                      <motion.li key={text} whileTap={{ scale: 0.98 }}>
                        <Link
                          to={path}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            sidebarStyles.mobileMenuItem.base,
                            pathname === path
                              ? sidebarStyles.mobileMenuItem.active
                              : sidebarStyles.mobileMenuItem.inactive
                          )}
                        >
                          <span
                            className={
                              pathname === path
                                ? sidebarStyles.menuIcon.active
                                : sidebarStyles.menuIcon.inactive
                            }
                          >
                            {icon}
                          </span>
                          <span>{text}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* footer */}
                <div className={sidebarStyles.mobileFooter}>
                  <a
                    href="https://hexagondigitalservices.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className={sidebarStyles.mobileFooterLink}
                  >
                    <HelpCircle size={20} className="text-gray-500" />
                    <span>Support</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className={sidebarStyles.mobileLogoutButton}
                  >
                    <LogOut size={20} className="text-gray-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;