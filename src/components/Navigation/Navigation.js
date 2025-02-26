import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

function Navigation({ isLoggedIn, currentUser, onSignInModal, onLogout }) {
  const reactLocation = useLocation();
  const currentLocation = reactLocation.pathname;

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    console.log("Current User in Navigation:", currentUser);
  }, [currentLocation, currentUser]);

  return (
    <nav className="nav">
      <div className="nav__left-container nav__logo-container">
        <Link to="/" className="nav__logo-link">
          <h2
            className={`nav__logo ${
              currentLocation === "/"
                ? "nav__logo-home"
                : "nav__logo-saved-news"
            }`}
          >
            NewsExplorer
          </h2>
        </Link>
      </div>

      <button
        className={`nav__menu-icon ${menuOpen ? "open" : ""} ${
          currentLocation === "/saved-news" ? "saved-news" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((prev) => !prev);
        }}
      >
        <span></span>
        <span></span>
      </button>

      <div className={`nav__right-container ${menuOpen ? "nav__open" : ""}`}>
        <ul className="nav__container-links">
          <li className="nav__item">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <button
                className={`nav__button nav__button-action ${
                  currentLocation === "/"
                    ? "nav__btn-active-home"
                    : "nav__btn-active-home-saved"
                }`}
              >
                Home
              </button>
            </Link>
          </li>

          {isLoggedIn && (
            <li>
              <Link to="/saved-news" onClick={() => setMenuOpen(false)}>
                <button
                  className={
                    currentLocation === "/saved-news"
                      ? "nav__btn-saved-news nav__btn-active-saved-news"
                      : "nav__btn"
                  }
                >
                  Saved Articles
                </button>
              </Link>
            </li>
          )}

          {!isLoggedIn && (
            <li>
              <button
                className="nav__menu-signin-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSignInModal();
                }}
              >
                Sign in
              </button>
            </li>
          )}

          {isLoggedIn && (
            <li>
              <button
                className={`nav__btn-logout ${
                  currentLocation === "/saved-news"
                    ? "nav__btn-logout-saved-news"
                    : ""
                }`}
                onClick={() => {
                  onLogout();
                  setMenuOpen(false);
                }}
              >
                {currentUser?.name || "User"}
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
