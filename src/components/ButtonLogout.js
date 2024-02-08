"use client";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const ButtonLogout = ({ children, className, onClick, ...moreProps }) => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("access_token");
    return router.push("/");
  };

  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLogout();
        if (onClick) return onClick(e);
      }}
      {...moreProps}
    >
      {children}
    </button>
  );
};

ButtonLogout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
export { ButtonLogout };
