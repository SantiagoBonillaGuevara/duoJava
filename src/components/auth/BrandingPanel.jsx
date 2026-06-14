import Logo from "@/components/ui/Logo";

const BrandingPanel = ({ title, subtitle, benefits }) => {
  return (
    <div className="auth-branding-panel">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6324eb]/20 blur-[120px] rounded-full" />
      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3 text-white">
        <div className="size-10 text-[#6324eb]">
          <Logo />
        </div>
        <h2 className="text-2xl font-black tracking-tight">duoJava</h2>
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 max-w-lg">
        <div>
          <h1 className="text-white text-5xl font-black leading-tight tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">{subtitle}</p>
        </div>

        {benefits && (
          <div className="flex flex-col gap-6 mt-4">
            {benefits.map(({ icon, text }) => (
              <div key={icon} className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#6324eb]/10 text-[#6324eb]">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <p className="text-slate-200 font-medium">{text}</p>
              </div>
            ))}
          </div>
        )}

        <div className="code-card-container rotate-2 hover:rotate-0">
          <div className="flex gap-1.5 mb-4">
            <div className="code-dot bg-red-500" />
            <div className="code-dot bg-yellow-500" />
            <div className="code-dot bg-green-500" />
          </div>
          <code className="text-sm font-mono block text-slate-300">
            <span className="text-[#6324eb]">public class</span>{" "}
            <span className="text-yellow-400">Main</span> {"{"}
            <br />
            &nbsp;&nbsp;
            <span className="text-[#6324eb]">public static void</span>{" "}
            <span className="text-blue-400">main</span>(String[] args) {"{"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;System.out.println(
            <span className="text-green-400">"Keep coding!"</span>);
            <br />
            &nbsp;&nbsp;{"}"}
            <br />
            {"}"}
          </code>
        </div>
      </div>
      <div /> {/* Spacer to match the justify-between */}
    </div>
  );
};

export default BrandingPanel;
