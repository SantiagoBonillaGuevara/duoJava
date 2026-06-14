import { useState } from "react";

const PasswordInput = ({ password, placeholder, handleChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={password}
        onChange={handleChange}
        required
        className="auth-input pr-11"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        <span className="material-symbols-outlined text-[20px]">
          {showPassword ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );
};

export default PasswordInput;
