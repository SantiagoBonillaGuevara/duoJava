import { useState, useEffect } from "react";
import { signOut } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { getLevels, updateProfile } from "@/api/endpoints";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { buildAvatarCatalog } from "@/utils/avatars";

// Components
import Sidebar from "@/components/nav/Sidebar";

// Styles
import "@/styles/dashboard.css";
import "@/styles/profile.css";
import "@/styles/auth.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, session, updateUser } = useAuthStore();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    displayName: user?.displayName || "",
    avatarUrl: user?.avatarUrl || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Username validation
  const { available, checking } = useUsernameCheck(formData.username);
  const isUsernameModified = formData.username !== user?.username;
  const isUsernameValid =
    !isUsernameModified ||
    (available && !checking && formData.username.length >= 3);

  const catalog = buildAvatarCatalog(user?.googleAvatarUrl);

  const memberSince = session?.user?.created_at
    ? new Date(session.user.created_at).toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      })
    : "Recientemente";

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const { data } = await getLevels();
        const sortedLevels = data.sort((a, b) => a.levelNumber - b.levelNumber);
        setLevels(sortedLevels);
      } catch (error) {
        console.error("Error fetching levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  // Update formData when user data loads/changes
  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      });
    }
  }, [user, isEditing]);

  const handleLogout = async () => {
    try {
      await signOut();
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      logout();
      navigate("/login");
    }
  };

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    if (!isUsernameValid) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      // Build request - only include modified fields
      const request = {};
      if (formData.username !== user.username)
        request.username = formData.username;
      if (formData.displayName !== user.displayName)
        request.displayName = formData.displayName;
      if (formData.avatarUrl !== user.avatarUrl)
        request.avatarUrl = formData.avatarUrl;

      if (Object.keys(request).length === 0) {
        setIsEditing(false);
        setSaving(false);
        return;
      }

      const { data } = await updateProfile(request);
      updateUser(data);
      setSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.detail || "Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const currentLevelNumber = user?.levelNumber || 1;
  const currentLevel = levels.find((l) => l.levelNumber === currentLevelNumber);

  return (
    <div className="dashboard-container">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="dashboard-main">
        <div className="dashboard-content-wrapper">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Mi Perfil
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  setShowAvatarPicker(false);
                  setError("");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  isEditing
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    : "bg-[#6324eb] text-white hover:bg-[#6324eb]/90 shadow-lg shadow-[#6324eb]/20"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {isEditing ? "close" : "edit"}
                </span>
                {isEditing ? "Cancelar" : "Editar Perfil"}
              </button>
            </div>
          </header>

          {isEditing ? (
            /* Edit Form Mode */
            <section className="profile-hero mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Avatar Edit */}
                <div className="flex flex-col items-center gap-4 mx-auto md:mx-0">
                  <div className="profile-avatar-container">
                    <img
                      src={formData.avatarUrl}
                      alt="Preview"
                      className="profile-avatar ring-4 ring-[#6324eb]/30"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                          e.stopPropagation();
                          setShowAvatarPicker(!showAvatarPicker);
                      }}
                      className="absolute bottom-2 right-2 bg-[#6324eb] text-white p-2 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all z-20"
                    >
                      <span className="material-symbols-outlined text-xl">photo_camera</span>
                    </button>
                  </div>

                  {showAvatarPicker && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-[280px] animate-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">Selecciona tu Avatar</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {catalog.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, avatarUrl: av.url });
                              setShowAvatarPicker(false);
                            }}
                            className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                              formData.avatarUrl === av.url ? "border-[#6324eb] ring-2 ring-[#6324eb]/20" : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <img src={av.url} alt={av.id} className="w-full aspect-square object-cover" />
                            {av.label && (
                              <span className="absolute top-0 left-0 bg-[#6324eb] text-[6px] text-white px-1 rounded-br">G</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fields Edit */}
                <form
                  onSubmit={handleUpdateProfile}
                  className="flex-1 w-full space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="auth-input-group">
                      <label className="auth-label">Nombre de usuario</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              username: e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9_]/g, ""),
                            })
                          }
                          className={`auth-input ${isUsernameModified ? "" : "focus:ring-[#6324eb]"}`}
                          placeholder="username"
                          style={
                            isUsernameModified
                              ? {
                                  borderColor: isUsernameValid
                                    ? "#10b981"
                                    : "#ef4444",
                                  boxShadow: isUsernameValid
                                    ? "0 0 0 2px rgba(16, 185, 129, 0.1)"
                                    : "0 0 0 2px rgba(239, 68, 68, 0.1)",
                                }
                              : {}
                          }
                        />
                        <span className="absolute right-3 flex items-center">
                          {checking ? (
                            <span className="text-slate-400 material-symbols-outlined text-base animate-spin">
                              sync
                            </span>
                          ) : isUsernameModified && isUsernameValid ? (
                            <span className="text-emerald-500 material-symbols-outlined">
                              check_circle
                            </span>
                          ) : isUsernameModified && !isUsernameValid ? (
                            <span className="text-red-500 material-symbols-outlined">
                              cancel
                            </span>
                          ) : null}
                        </span>
                      </div>
                      {isUsernameModified && !checking && (
                        <p
                          className={`text-[11px] font-bold ${isUsernameValid ? "text-emerald-500" : "text-red-500"}`}
                        >
                          {isUsernameValid
                            ? "¡Nombre de usuario disponible!"
                            : formData.username.length < 3
                              ? "El usuario debe tener al menos 3 caracteres"
                              : "Nombre de usuario ya ocupado"}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-500 uppercase tracking-tight">
                        Solo letras, números y guiones bajos.
                      </p>
                    </div>

                    <div className="auth-input-group">
                      <label className="auth-label">Nombre visible</label>
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            displayName: e.target.value,
                          })
                        }
                        className="auth-input"
                        placeholder="Tu nombre completo"
                      />
                      <p className="text-[10px] text-slate-500 uppercase tracking-tight">
                        Este es el nombre que verán los demás.
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        error
                      </span>
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={
                        saving ||
                        !isUsernameValid ||
                        (formData.username === user.username &&
                          formData.displayName === user.displayName &&
                          formData.avatarUrl === user.avatarUrl)
                      }
                      className="auth-button-primary !w-auto px-8 flex items-center gap-2"
                    >
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="material-symbols-outlined text-xl">
                          save
                        </span>
                      )}
                      {success ? "¡Perfil Actualizado!" : "Guardar Cambios"}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          ) : (
            /* Normal Mode */
            <section className="profile-hero mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="profile-avatar-container group">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className="profile-avatar"
                    />
                  ) : (
                    <div className="profile-avatar flex items-center justify-center bg-[#6324eb]/20 text-[#6324eb] text-4xl font-bold">
                      {user?.displayName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left flex-1">
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                    {user?.displayName}
                  </h2>
                  <p className="text-xl text-slate-500 dark:text-slate-400 mb-4">
                    @{user?.username}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-lg">
                      calendar_today
                    </span>
                    <span className="text-sm font-medium">
                      Miembro desde {memberSince}
                    </span>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="status-badge flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Compilando habilidades
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Stats Grid */}
          <section className="stats-grid mb-12">
            {/* Streak */}
            <div className="stat-card group">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined stat-icon text-orange-500 filled-icon">
                  local_fire_department
                </span>
                <span className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Activo
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
                Racha Actual
              </p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">
                {user?.streak || 0}{" "}
                <span className="text-lg font-bold text-slate-500">días</span>
              </p>
            </div>

            {/* Total XP */}
            <div className="stat-card group">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined stat-icon text-blue-500 filled-icon">
                  military_tech
                </span>
                <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Total
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
                Experiencia Total
              </p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">
                {(user?.xp || 0).toLocaleString()}
              </p>
            </div>

            {/* Rank */}
            <div className="stat-card group">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined stat-icon text-purple-500 filled-icon">
                  school
                </span>
                <span className="bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Rango
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
                Nivel Actual
              </p>
              <p className="text-xl font-black text-slate-900 dark:text-white truncate">
                {loading ? "Cargando..." : currentLevel?.title || "Novato"}
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-[#6324eb] h-full transition-all duration-500"
                  style={{
                    width: `${(user?.levelNumber / (levels.length || 10)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Lessons */}
            <div className="stat-card group">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined stat-icon text-emerald-500 filled-icon">
                  task_alt
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
                Lecciones Completas
              </p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">
                {user?.completedLessons || 0}
              </p>
            </div>
          </section>

          {/* Achievements Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6324eb] filled-icon">
                  auto_awesome
                </span>
                Logros Obtenidos
              </h3>
              <button className="text-[#6324eb] font-bold text-sm hover:underline">
                Ver todos
              </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
              {/* Achievement 1 */}
              <div className="achievement-badge">
                <div className="achievement-icon-container bg-gradient-to-br from-blue-500 to-indigo-600">
                  <span className="material-symbols-outlined text-4xl text-white">
                    repeat
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Loop Master
                </p>
              </div>

              {/* Achievement 2 */}
              <div className="achievement-badge">
                <div className="achievement-icon-container bg-gradient-to-br from-emerald-400 to-teal-600">
                  <span className="material-symbols-outlined text-4xl text-white">
                    terminal
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Syntax Ninja
                </p>
              </div>

              {/* Achievement 3 */}
              <div className="achievement-badge">
                <div className="achievement-icon-container bg-gradient-to-br from-purple-500 to-pink-600">
                  <span className="material-symbols-outlined text-4xl text-white">
                    data_object
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  First Program
                </p>
              </div>

              {/* Locked 1 */}
              <div className="achievement-badge achievement-locked">
                <div className="achievement-icon-container bg-slate-200 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-600">
                    lock
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                  Algorithm Ace
                </p>
              </div>

              {/* Locked 2 */}
              <div className="achievement-badge achievement-locked">
                <div className="achievement-icon-container bg-slate-200 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-600">
                    lock
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                  Thread Titan
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
