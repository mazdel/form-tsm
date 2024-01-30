"use client";
import PropTypes from "prop-types";
import Image from "next/image";
import Cookie from "js-cookie";
import { AuthDecode } from "@/libs/Auth";
import { ButtonLogout } from "@/components/ButtonLogout";
import { ButtonTheme } from "./ButtonTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useSettingsContext } from "@/contexts/SettingsContext";
import avatar from "@/public/images/icon-tsmjember-ig-sm.png";
import globalConfig from "@/configs/global";

const { CONSTANT } = globalConfig;
const Sidemenu = ({ className = "" }) => {
  const { settings, setUp } = useSettingsContext();
  const token = Cookie.get(CONSTANT.ACCESS_TOKEN);
  const user = AuthDecode(token);

  return (
    <aside
      className={`fixed 
      ${
        settings.isMenuOpen == CONSTANT.SIDEMENU.OPEN ? "right-0" : "-right-48"
      } 
      top-0 z-50 flex h-screen w-44 flex-col justify-between bg-violet-50 p-2
      text-violet-900 shadow-lg transition-all duration-500 dark:bg-violet-950 dark:text-white
      ${className}`}
    >
      <section className="flex w-full flex-col items-center justify-start">
        <button
          className="self-start p-2 px-3.5 text-base"
          onClick={() => {
            setUp({ isMenuOpen: CONSTANT.SIDEMENU.CLOSE });
          }}
        >
          <FontAwesomeIcon icon={faTimes} className="h-6 opacity-50" />
        </button>
        <div className="mb-3 h-24 w-24 overflow-hidden rounded-full">
          <Image src={avatar} alt="avatar" width="auto" height="auto" />
        </div>
        <div className="w-full border-b border-violet-300 pb-2 text-center">
          Hai, {user?.username ?? ""}
        </div>
        <ButtonLogout
          type="button"
          className="flex w-full items-center justify-center rounded-lg p-3 text-base"
        >
          <span className="mr-2 font-bold">Log Out</span>
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-5" />
        </ButtonLogout>
      </section>
      <section className="flex justify-center">
        <ButtonTheme />
      </section>
    </aside>
  );
};

Sidemenu.propTypes = {
  className: PropTypes.string,
};

export { Sidemenu };
