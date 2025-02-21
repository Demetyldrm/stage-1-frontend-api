import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./App.css";
import Header from "../Header/Header";
import SavedNews from "../SavedNewsPage/SavedNews.js";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import SignInModal from "../SignInModal/SignInModal";
import SignUpModal from "../SignUpModal/SignUpModal";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { useDispatch } from "react-redux";
import { reloadSavedArticles } from "../../store/newsSlice";

import {
  getNewsByDateAndKeyword,
  getSavedArticles,
} from "../../store/newsSlice.js";
import { signUp, authorize } from "../../utils/auth.js";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [serverErrors, setServerErrors] = useState("");
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setActiveModal(null);
    setIsSuccessModalOpen(false);
  };

  const handleSignInModal = () => {
    console.log("Sign-in button clicked - Opening modal");
    setActiveModal("signIn");
  };

  const handleSignUp = async (values) => {
    try {
      const response = await signUp(
        values.email,
        values.password,
        values.username
      );
      setCurrentUser(response.data);
      setIsLoggedIn(true);
      setActiveModal(null);

      setTimeout(() => {
        setIsSuccessModalOpen(true);
      }, 300);
    } catch (error) {
      setServerErrors(error.message);
    }
  };

  const handleSignIn = async (values) => {
    try {
      const response = await authorize(values.email, values.password);
      setIsLoggedIn(true);
      setCurrentUser({ name: values.name, email: values.email });
      setActiveModal(null);
    } catch (error) {
      setServerErrors("Invalid email or password");
    }
  };

  const handleSignInFromSuccess = () => {
    setIsSuccessModalOpen(false);
    setActiveModal("signIn");
  };

  const handleLogout = () => {
    console.log("Logging out user...");

    setIsLoggedIn(false);
    setCurrentUser(null);

    dispatch({ type: "news/clearSavedArticles" });
    localStorage.removeItem("savedNews");

    navigate("/");
  };

  const handleNewsArticleSearch = (keyword) => {
    setIsPageLoading(true);
    dispatch(getNewsByDateAndKeyword({ keyword }))
      .unwrap()
      .then(() => setIsSearching(true))
      .catch(() => setServerErrors("Error fetching news"))
      .finally(() => setIsPageLoading(false));
  };

  useEffect(() => {
    dispatch(reloadSavedArticles());
  }, [dispatch]);

  useEffect(() => {
    function handleCloseMethods(evt) {
      if (evt.key === "Escape") {
        handleCloseModal();
      }
    }

    function handleOutsideClick(evt) {
      if (evt.target.classList.contains("modal")) {
        handleCloseModal();
      }
    }

    if (activeModal || isSuccessModalOpen) {
      document.addEventListener("keydown", handleCloseMethods);
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("keydown", handleCloseMethods);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [activeModal, isSuccessModalOpen]);

  return (
    <div className="page">
      {location.pathname !== "/saved-news" && (
        <Header
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onSignInModal={() => setActiveModal("signIn")}
          onSignUpModal={() => setActiveModal("signUp")}
          onLogout={handleLogout}
          onSubmit={handleNewsArticleSearch}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Main
              isLoggedIn={isLoggedIn}
              isSearching={isSearching}
              isPageLoading={isPageLoading}
              handleSignInModal={handleSignInModal}
            />
          }
        />
        <Route
          path="/saved-news"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SavedNews isLoggedIn={isLoggedIn} currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />

      {activeModal === "signIn" && (
        <SignInModal
          isOpen={activeModal === "signIn"}
          handleCloseModal={handleCloseModal}
          onSignUpModal={() => setActiveModal("signUp")}
          onSubmit={handleSignIn}
          serverErrors={serverErrors}
        />
      )}

      {activeModal === "signUp" && (
        <SignUpModal
          isOpen={activeModal === "signUp"}
          handleCloseModal={handleCloseModal}
          onSignInModal={() => setActiveModal("signIn")}
          onSubmit={handleSignUp}
          serverErrors={serverErrors}
        />
      )}
      {/* Success Modal */}
      {isSuccessModalOpen && (
        <ModalWithForm
          modalName="success"
          isOpen={isSuccessModalOpen}
          onClose={handleCloseModal}
          message="Registration successfully completed!"
          customClass="modal__success"
          onSignIn={handleSignInFromSuccess}
        />
      )}
    </div>
  );
}

export default App;
