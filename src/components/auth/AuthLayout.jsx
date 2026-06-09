import Logo from "@/components/ui/Logo";

const AuthLayout = ({ children, title, subtitle, error, useCard = false }) => {
  return (
    <div className="auth-layout-container">
      <div className={useCard ? 'auth-card' : 'auth-form-container'}>
        <div className="flex flex-col gap-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="size-8 text-[#6324eb]">
              <Logo />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              duoJava
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
