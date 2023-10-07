import { createStore, combineReducers, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import thunk from "redux-thunk";
import { auth } from "../../firebase/firebase";

const defaultProfileImage = require("./graduate.png");
const initialUserProfileState = {
  userType: "Student",
  username: "Student",
  profileImage: defaultProfileImage,
  userId: "",
  about: "",
};

const initialCampusState = {
  campus: null,
  id: null,
  faculty: null,
  course: null,
  studentNumber: null,
  yearOfAdmission: null,
};

const initialFilterState = {
  filter: "All",
};

const userProfileReducer = (state = initialUserProfileState, action) => {
  switch (action.type) {
    case "SET_USER_PROFILE":
      return {
        ...state,
        ...action.payload,
      };
    case "CLEAR_USER_PROFILE":
      return {
        ...initialUserProfileState,
      };
    default:
      return state;
  }
};

const campusReducer = (state = initialCampusState, action) => {
  // console.log("Reducer called with action:", action);
  // console.log("Initial state:", state);

  switch (action.type) {
    case "SET_CAMPUS":
      const newState = {
        ...state,
        campus: action.payload.campus,
        id: action.payload.id,
        faculty: action.payload.faculty,
        course: action.payload.course,
        studentNumber: action.payload.studentNumber,
        yearOfAdmission: action.payload.yearOfAdmission,
      };
      // console.log("New state:", newState);
      return newState;
    default:
      return state;
  }
};

const filterReducer = (state = initialFilterState, action) => {
  // console.log("Reducer called with action:", action);
  switch (action.type) {
    case "SET_FILTER":
      const newState = {
        ...state,
        filter: action.payload.filter,
      };
      // console.log("New state:", newState);
      return newState;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  userProfile: userProfileReducer,
  campus: campusReducer,
  filter: filterReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["userProfile", "campus", "filter"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];

const store = createStore(
  persistedReducer,
  applyMiddleware(...middleware)
);

const persistor = persistStore(store, null, () => {
  console.log("Store rehydrated");
});

export { store, persistor };

export const logout = () => {
  return async (dispatch) => {
    try {
      await auth.signOut();
      dispatch({ type: "CLEAR_USER_PROFILE" });
    } catch (error) {
      console.log(error);
    }
  };
};
