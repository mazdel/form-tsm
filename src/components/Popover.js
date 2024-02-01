"use client";

import PropTypes from "prop-types";

const Popover = ({
  children,
  className = "",
  side = "bottom",
  show = false,
  setPopoverVisible,
  ...restProps
}) => {
  let borderDirection = `border-b-current`,
    flexDirection = "flex-col",
    additionalCSS = `top-1`;

  switch (side) {
    case "top":
      borderDirection = `border-t-current`;
      flexDirection = "flex-col-reverse";
      additionalCSS = `bottom-1`;
      break;
  }
  return (
    <div
      onClick={() => setPopoverVisible(false)}
      className={`
        absolute z-10 flex ${flexDirection} m-1 items-center justify-center
        transition-opacity duration-300 ${additionalCSS}
        ${show ? "visible opacity-100" : "invisible opacity-0"}
        ${className}
      `}
      {...restProps}
    >
      <div
        className={`h-0 w-0 border-[0.8em] border-solid border-transparent ${borderDirection}`}
      ></div>
      <div className="flex flex-auto cursor-pointer overflow-hidden rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};
Popover.propTypes = {
  children: PropTypes.node,
  side: PropTypes.oneOf(["bottom", "top", "left", "right"]),
  className: PropTypes.string,
  show: PropTypes.bool,
  setPopoverVisible: PropTypes.func,
  
};
export { Popover };
