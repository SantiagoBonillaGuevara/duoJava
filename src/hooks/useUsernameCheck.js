import { useState, useEffect } from "react";
import { isUsernameAvailable } from "@/api/endpoints";

export function useUsernameCheck(username) {
  const [available, setAvailable] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (username.length < 3) {
      setAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const { data } = await isUsernameAvailable(username);
        setAvailable(data.available);
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  return { available, checking };
}
