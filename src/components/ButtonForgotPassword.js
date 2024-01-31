"use client";

import PropTypes from "prop-types";
import { Popover } from "./Popover";
import { useState, useRef } from "react";

const ButtonForgotPassword = ({
  className,
  buttonText,
  children,
  ...moreProps
}) => {
  const [popoverState, setPopoverVisible] = useState(false);
  const buttonRef = useRef(null);
  const handlePopover = (show) => {
    return setPopoverVisible(show);
  };
  return (
    <div className={className} {...moreProps}>
      <button
        ref={buttonRef}
        type="button"
        className="p-0 hover:underline"
        onClick={() => handlePopover(!popoverState)}
      >
        {buttonText}
      </button>
      <Popover
        side="bottom"
        show={popoverState}
        setPopoverVisible={setPopoverVisible}
        buttonRef={buttonRef}
      >
        <div className="bg-violet-900 p-2 text-white">{children}</div>
      </Popover>
    </div>
  );
};

ButtonForgotPassword.propTypes = {
  className: PropTypes.string,
  buttonText: PropTypes.string,
  children: PropTypes.node,
};
export { ButtonForgotPassword };
