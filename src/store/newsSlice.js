import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { newsApiInstance } from "../utils/api";

const getSavedNewsFromLocalStorage = () => {
  const savedNews = JSON.parse(localStorage.getItem("savedNews"));
  return Array.isArray(savedNews) ? savedNews : [];
};

const initialState = {
  news: [],
  savedNews: getSavedNewsFromLocalStorage(),
  loading: false,
  err: "",
};

export const getNewsByDateAndKeyword = createAsyncThunk(
  "news/getNewsByDateAndKeyword",
  async ({ keyword, fromDate, toDate }, thunkAPI) => {
    try {
      const response = await newsApiInstance.get("/", {
        params: { q: keyword, from: fromDate, to: toDate, pageSize: 100 },
      });

      console.log("🔍 API Response Articles:", response.data.articles);

      return response.data.articles;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "An error occurred"
      );
    }
  }
);
export const reloadSavedArticles = createAsyncThunk(
  "news/reloadSavedArticles",
  async () => getSavedNewsFromLocalStorage()
);
export const saveArticle = createAsyncThunk(
  "news/saveArticle",
  async ({ newsItem, searchKeyword }, thunkAPI) => {
    try {
      console.log("🔹 Saving article with search keyword:", searchKeyword);

      const savedNews = getSavedNewsFromLocalStorage();

      if (savedNews.some((item) => item.title === newsItem.title)) {
        return thunkAPI.rejectWithValue("Article is already saved.");
      }

      const extractedKeyword =
        searchKeyword?.trim() || newsItem.keyword || "Keyword"; // trying to fix this

      const updatedNewsItem = {
        ...newsItem,
        keyword: extractedKeyword,
      };

      const updatedSavedNews = [...savedNews, updatedNewsItem];
      localStorage.setItem("savedNews", JSON.stringify(updatedSavedNews));

      return updatedNewsItem;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error saving article");
    }
  }
);
export const removeSavedArticle = createAsyncThunk(
  "news/removeSavedArticle",
  async (newsItem, thunkAPI) => {
    try {
      const savedNews = getSavedNewsFromLocalStorage();
      const updatedSavedNews = savedNews.filter(
        (item) => item.url !== newsItem.url
      );
      localStorage.setItem("savedNews", JSON.stringify(updatedSavedNews));

      return newsItem;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error removing article");
    }
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getNewsByDateAndKeyword.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNewsByDateAndKeyword.fulfilled, (state, action) => {
        state.news = action.payload;
        state.loading = false;
        state.err = "";
      })
      .addCase(getNewsByDateAndKeyword.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload || "Problem fetching news.";
      })

      .addCase(reloadSavedArticles.fulfilled, (state, action) => {
        state.savedNews = action.payload;
      })

      .addCase(saveArticle.fulfilled, (state, action) => {
        state.savedNews.push(action.payload);
        state.err = "";
      })
      .addCase(saveArticle.rejected, (state, action) => {
        state.err = action.payload;
      })

      .addCase(removeSavedArticle.fulfilled, (state, action) => {
        state.savedNews = state.savedNews.filter(
          (item) => item.title !== action.payload.title
        );
        state.err = "";
      })
      .addCase(removeSavedArticle.rejected, (state, action) => {
        state.err = action.payload;
      });
  },
});

export default newsSlice.reducer;
