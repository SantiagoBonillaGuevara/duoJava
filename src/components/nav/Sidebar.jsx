import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import NavItem from "./NavItem";
import Logo from "@/components/ui/Logo";
import { handleLogout } from "@/utils/handleLogout";

const Sidebar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return (
    <aside className="dashboard-sidebar">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="bg-[#6324eb] rounded-lg p-1.5 flex items-center justify-center">
            <Logo className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            duoJava
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2">
          <NavItem
            icon="home"
            label="Inicio"
            to="/"
            active={location.pathname === "/"}
          />
          <NavItem
            icon="menu_book"
            label="Cursos"
            to="/courses"
            active={location.pathname === "/courses"}
          />
          <NavItem
            icon="leaderboard"
            label="Clasificación"
            to="/leaderboard"
            active={location.pathname === "/leaderboard"}
          />
          <NavItem
            icon="person"
            label="Perfil"
            to="/profile"
            active={location.pathname === "/profile"}
          />
        </nav>
      </div>

      {/* User card */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6 lg:mt-0">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="relative flex-shrink-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#6324eb]/20 flex items-center justify-center text-[#6324eb] font-bold text-sm">
                {user?.displayName?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-[#F97316] text-[10px] font-bold text-white px-1 rounded-full border-2 border-white dark:border-[#1E293B]">
              L{user?.levelNumber}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {user?.displayName}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              @{user?.username}
            </span>
          </div>
          <button
            onClick={() => handleLogout({ logout, navigate })}
            title="Cerrar sesión"
            className="ml-auto text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
