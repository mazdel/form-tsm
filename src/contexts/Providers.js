"use client";
import PropTypes from "prop-types";
// import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ThemeContext } from "@/contexts/ThemeContext";

const Providers = ({ children }) => {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const changeTheme = () => {
    setTheme(theme == "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, changeTheme }}>
      <html lang="en" className={theme}>
        {children}
      </html>
    </ThemeContext.Provider>
  );
};

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Providers };
