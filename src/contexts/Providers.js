"use client";
import PropTypes from "prop-types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SettingsContext } from "./SettingsContext";
import { useMemo, useReducer } from "react";
import globalConfig from "@/configs/global";

const { CONSTANT } = globalConfig;
const Providers = ({ children }) => {
  const [localTheme, setTheme] = useLocalStorage("theme", CONSTANT.THEME.LIGHT);
  const settingsReducer = (prevState, action) => {
    let updatedState = {};
    if (action.theme) {
      setTheme(action.theme);
      updatedState = { ...updatedState, theme: action.theme };
    }
    if (action.isMenuOpen) {
      updatedState = { ...updatedState, isMenuOpen: action.isMenuOpen };
    }
    if (action.user) {
      updatedState = { ...updatedState, user: action.user };
    }
    return { ...prevState, ...updatedState };
  };
  const [settings, setUp] = useReducer(settingsReducer, {
    theme: localTheme,
    isMenuOpen: CONSTANT.SIDEMENU.CLOSE,
    user: {},
  });
  useMemo(() => {
    if (localTheme != settings.theme) {
      return setUp({ theme: localTheme });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTheme]);

  return (
    <SettingsContext.Provider value={{ settings, setUp }}>
      <html lang="en" className={`${settings.theme}`}>
        {children}
      </html>
    </SettingsContext.Provider>
  );
};

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Providers };
