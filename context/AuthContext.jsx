"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      const loggedInUser = data;

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(data));
      // console.log(user)
      // ✅ Use loggedInUser directly instead of user
      // if (loggedInUser?.role === "admin" || loggedInUser?.role === "press") {
      //   router.replace("/admin");
      // } else {
      //   router.replace("/");
      // }
    } catch (err) {
      console.error("Login error:", err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const logout = async () => {
    try {
   
      setUser(null);
      localStorage.removeItem("user");
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
