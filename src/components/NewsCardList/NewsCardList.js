import React, { useState } from "react";
import NewsCard from "../NewsCard/NewsCard";
import "./NewsCardList.css";
import NothingFound from "../NothingFound/NothingFound";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function NewsCardList({
  isLoggedIn,
  isPageLoading,
  isSearching,
  handleSignInModal,
}) {
  let [cardView, setCardView] = useState(3);
  const location = useLocation().pathname;
  const allNews = useSelector((state) => state.articles.news);
  const savedNews = useSelector((state) => state.articles.savedNews);

  // Show saved articles if on /saved-news, otherwise show search results
  const news = location === "/saved-news" ? savedNews : allNews;

  console.log("Rendering NewsCardList. Showing:", news.length, "articles");

  return !isPageLoading && isSearching && news.length === 0 ? (
    <NothingFound />
  ) : !isPageLoading && isSearching && news.length >= 1 ? (
    <section className="newscardlist">
      {location !== "/saved-news" && (
        <h2 className="newscardlist__result">Search results</h2>
      )}

      <ul className="newscardlist__container">
        {news.slice(0, cardView).map((newsItem, index) => (
          <NewsCard
            key={index}
            newsItem={newsItem}
            isLoggedIn={isLoggedIn}
            isSaved={location === "/saved-news"}
            handleSignInModal={handleSignInModal}
          />
        ))}
      </ul>

      {cardView <= news.length ? (
        <button
          className="newscardlist__button-show-more"
          type="button"
          onClick={() => setCardView(cardView + 3)}
        >
          Show more
        </button>
      ) : null}
    </section>
  ) : null;
}

export default NewsCardList;
