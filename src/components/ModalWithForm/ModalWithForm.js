import React from "react";

import "./ModalWithForm.css";

function ModalWithForm({
  children,
  modalName,
  onClose,
  onSubmit,
  isOpen,
  message,
  onSignIn,
}) {
  return (
    <div
      className={`modal modal__type-${modalName} ${
        isOpen ? "modal__open " : ""
      }`}
      role="dialog"
      aria-hidden={!isOpen}
      aria-labelledby={`${modalName}-title`}
    >
      <div
        className={`modal__content ${
          modalName === "signUp"
            ? "modal__content-singUp modal__content-success"
            : ""
        }`}
      >
        <button
          className="modal__close-button "
          type="button"
          onClick={onClose}
          aria-label="Close"
        />
        {message ? (
          <div className="modal__message">
            <h2 className="modal__register-message">{message}</h2>
            <button className="modal__action-button" onClick={onSignIn}>
              Sign in
            </button>
          </div>
        ) : (
          <form className="modal__form modal__form-signUp" onSubmit={onSubmit}>
            {children}
          </form>
        )}
      </div>
    </div>
  );
}

export default ModalWithForm;
