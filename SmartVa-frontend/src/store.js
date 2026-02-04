// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Import your slices
import profileApi from "./redux/Profile/ProfileSlice";
import overviewApi from "./redux/dashboard/OverviewSlice";  // RTK Query API slice
import taskApi from "./redux/Task/TaskSlice";      
import contactApi from "./redux/Contact/ContactSlice";          // RTK Query API slice
import noteApi from "./redux/Note/NoteSlice";
import documentApi from "./redux/document/DocumentSlice";
import visitorApi from "./redux/visitor/visitorSlice";
import eventApi from "./redux/event/EventSlice";

// If you also have normal reducers (not RTK Query), import them separately
// import someReducer from './redux/someSlice'

const store = configureStore({
  reducer: {
    // RTK Query reducers
    [overviewApi.reducerPath]: overviewApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [visitorApi.reducerPath]: visitorApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,

    // Normal reducers (if any)
    // some: someReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      overviewApi.middleware,
      taskApi.middleware,
      contactApi.middleware,
      noteApi.middleware,
      documentApi.middleware,
      visitorApi.middleware,
      eventApi.middleware,
      profileApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
