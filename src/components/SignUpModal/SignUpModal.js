import React, { useEffect, useMemo } from "react";
import { useFormWithValidation } from "../../hooks/useForm";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./SignUpModal.css";

function SignUpModal({
  isOpen,
  onSignInModal,
  handleCloseModal,
  onSubmit,
  isModalLoading,
  serverErrors,
}) {
  const defaultValues = useMemo(() => ({ email: "", password: "" }), []);

  const { values, handleChange, errors, isValid, resetForm } =
    useFormWithValidation(defaultValues);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <ModalWithForm
      modalName="signUp"
      isOpen={isOpen}
      onClose={handleCloseModal}
      onSubmit={handleSubmit}
    >
      <p id="signUp-title" className="modal__signUp-title">
        Sign up
      </p>

      <label className="modal__label" htmlFor="email">
        Email{" "}
      </label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter email"
        value={values.email || ""}
        onChange={handleChange}
        required
        className="modal__input"
      />
      <span className="modal__error">{errors.email}</span>

      <label className="modal__label">Password </label>
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        value={values.password || ""}
        onChange={handleChange}
        required
        className="modal__input"
      />
      <span className="modal__error">{errors.password}</span>

      <label className="modal__label">UserName</label>
      <input
        type="username"
        name="username"
        placeholder="Enter your username"
        value={values.username || ""}
        onChange={handleChange}
        required
        className="modal__input"
      />
      <span className="modal__error">{errors.password}</span>

      <button
        type="submit"
        className={`modal__submit-button modal_button-signUp ${
          !isValid || isModalLoading ? "modal__submit-button_disabled" : ""
        }`}
        disabled={!isValid || isModalLoading}
      >
        {isModalLoading ? "Loading..." : "Sign Up"}
      </button>
      {serverErrors && (
        <span className="modal__error modal__error_general">
          {serverErrors}
        </span>
      )}
      <button
        className="modal__redirect-button"
        onClick={onSignInModal}
        type="button"
      >
        <span className="modal__redirect-button-text">or</span> Sign In
      </button>
    </ModalWithForm>
  );
}

export default SignUpModal;
