export const passwordStrength = (password) => {
  if (!password) return { label: "", color: "", width: "0%" };
  if (password.length < 6)
    return { label: "Débil", color: "bg-red-500", width: "25%" };
  if (password.length < 10)
    return { label: "Aceptable", color: "bg-yellow-500", width: "50%" };
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
    return { label: "Buena", color: "bg-blue-500", width: "75%" };
  return { label: "Fuerte", color: "bg-emerald-500", width: "100%" };
};

export const strengthColors = {
  Débil: "text-red-500",
  Aceptable: "text-yellow-500",
  Buena: "text-blue-500",
  Fuerte: "text-emerald-500",
};
