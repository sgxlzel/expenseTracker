import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, ArrowUp, ArrowDown, User, Plus } from "lucide-react";

const BottomNav = ({ onQuickAdd }) => {
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Income", path: "/income", icon: ArrowUp },
    { label: "Add", isAction: true },
    { label: "Expenses", path: "/expense", icon: ArrowDown },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#101124]/95 backdrop-blur-md border-t border-gray-200/90 dark:border-[#222448] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.4)] px-2 py-1.5"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          if (item.isAction) {
            return (
              <div key="quick-add" className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={onQuickAdd}
                  className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  aria-label="Quick Add Transaction"
                >
                  <Plus size={24} strokeWidth={2.5} />
                </button>
                <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 mt-0.5">
                  Add
                </span>
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors min-w-[56px] ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-300 font-semibold"
                  : "text-gray-500 dark:text-slate-300 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              <Icon
                size={20}
                className={isActive ? "stroke-[2.5]" : "stroke-2"}
              />
              <span className="text-[11px] mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
