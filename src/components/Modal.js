"use client";
import PropTypes from "prop-types";
import { useEffect, forwardRef } from "react";

const Modal = forwardRef(function Modal({ children, className }, dialogRef) {
  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
    return () => {
      //
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <dialog
      onClose={() => {
        dialogRef.current?.close();
      }}
      ref={dialogRef}
      className={`${className} hidden open:block`}
    >
      {children}
    </dialog>
  );
});

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Modal;
