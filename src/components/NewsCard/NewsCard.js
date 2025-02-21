import React, { useState } from "react";
import { formatSearchResDate } from "../../utils/helper";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveArticle, removeSavedArticle } from "../../store/newsSlice";
import "./NewsCard.css";
import blueBookmark from "../../images/blueBookmark.svg";
import bookmarkIcon from "../../images/bookmark-button-normal.svg";
import { useSelector } from "react-redux";
function NewsCard({
  isLoggedIn,
  newsItem,
  isSaved,

  handleSignInModal,
}) {
  const formattedDate = formatSearchResDate(
    newsItem.publishedAt || newsItem.date
  );
  const [showIcon, setShowIcon] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const location = useLocation().pathname;
  const dispatch = useDispatch();

  const handleShowIcon = () => setShowIcon(true);
  const handleHideIcon = () => setShowIcon(false);
  const searchKeyword = useSelector((state) => state.search?.searchTerm || "");
  const handleSaveClick = () => {
    console.log("🔹 Attempting to save article");
    console.log("🔍 searchKeyword before saving:", searchKeyword);
    console.log("🔍 newsItem before saving:", newsItem);

    if (isLoggedIn) {
      dispatch(saveArticle({ newsItem, searchKeyword }));
      setSaved(!saved);
    } else {
      handleSignInModal();
    }
  };
  const handleDeleteClick = () => {
    console.log("Deleting article:", newsItem);
    dispatch(removeSavedArticle(newsItem));
  };
  return (
    <li className="newscard__container">
      <article className="newscard">
        {isLoggedIn && location === "/saved-news" && (
          <div className="newscard__keyword">{newsItem.keyword}</div>
        )}

        <div className="newscard__bookmark">
          {!isLoggedIn && !saved && showIcon ? (
            <p className="newscard__bookmark-message">
              Sign in to save articles
            </p>
          ) : (saved && isLoggedIn && showIcon) ||
            (location === "/saved-news" && showIcon) ? (
            <p className="newscard__bookmark-message">Remove from saved</p>
          ) : null}

          {isLoggedIn && location === "/saved-news" ? (
            <button
              className="newscard__delete-button"
              onMouseOver={handleShowIcon}
              onMouseOut={handleHideIcon}
              onClick={handleDeleteClick}
            ></button>
          ) : (
            <button
              className={`newscard__bookmark-button ${
                saved ? "newscard__bookmark-button-active" : ""
              }`}
              onMouseOver={handleShowIcon}
              onMouseOut={handleHideIcon}
              onClick={handleSaveClick}
              style={{
                backgroundImage: `url(${saved ? blueBookmark : bookmarkIcon})`,
                backgroundColor: saved ? "##fff" : "#fff",
              }}
            ></button>
          )}
        </div>
        <div className="newscard__image-container">
          <img
            className="newscard__image"
            src={newsItem.urlToImage || newsItem.image}
            alt={newsItem.title || "News image"}
          />
        </div>
        <div className="newscard__info-container">
          <p className="newscard__info-date">{formattedDate}</p>
          <h3 className="newscard__info-title">{newsItem.title}</h3>
          <p className="newscard__info-text">
            {newsItem.description || newsItem.text}
          </p>
          <p className="newscard__info-publisher">
            {newsItem.source?.name || newsItem.name}
          </p>
        </div>
      </article>
    </li>
  );
}

export default NewsCard;
