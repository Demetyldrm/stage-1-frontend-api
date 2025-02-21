import React from "react";
import { useSelector } from "react-redux";
import "./SavedNews.css";
import Navigation from "../Navigation/Navigation";
import NewsCardList from "../NewsCardList/NewsCardList";
const SavedNews = ({ isLoggedIn }) => {
  const savedNews = useSelector((state) => state.articles.savedNews);
  const currentUser = useSelector((state) => state.user?.currentUser) || {
    name: "Demet",
  };
  const keywords = [...new Set(savedNews.map((article) => article.keyword))];
  const keywordText =
    keywords.length > 2
      ? `${keywords.slice(0, 2).join(", ")} and ${keywords.length - 2} other`
      : keywords.join(", ");

  return (
    <div className="saved-news-page">
      {/* Navigation Header */}
      <div className="saved-news-page__container">
        <Navigation isLoggedIn={isLoggedIn} currentUser={currentUser} />
      </div>

      <div className="saved-news-content">
        <h2 className="saved-news-title">Saved Articles</h2>

        <div className="saved-news-header">
          <h1 className="saved-news-header__title">
            {currentUser.name}, you have {savedNews.length} saved article
            {savedNews.length !== 1 ? "s" : ""}
          </h1>
          {savedNews.length > 0 && (
            <p className="saved-news-header__keywords">
              By keywords: <strong>{keywordText}</strong>
            </p>
          )}
        </div>

        {savedNews.length > 0 ? (
          <NewsCardList
            isLoggedIn={isLoggedIn}
            isPageLoading={false}
            isSearching={true}
            handleSignInModal={() => {}}
          />
        ) : (
          <p className="saved-news-message">No saved articles yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavedNews;
