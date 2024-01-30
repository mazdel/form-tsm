"use client";
import PropTypes from "prop-types";
import { useSettingsContext } from "@/contexts/SettingsContext";
import globalConfig from "@/configs/global";

const { CONSTANT } = globalConfig;
const ButtonSidemenu = ({ children, className }) => {
  const { setUp } = useSettingsContext();

  return (
    <button
      type="button"
      className={`${className}`}
      onClick={() => {
        setUp({ isMenuOpen: CONSTANT.SIDEMENU.OPEN });
      }}
    >
      {children}
    </button>
  );
};
ButtonSidemenu.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export { ButtonSidemenu };
