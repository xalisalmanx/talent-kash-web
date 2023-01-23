//Token and Key
import setToken from "../../util/setToken";
import setDevKey from "../../util/setDevKey";
import jwt_decode from "jwt-decode";
import { devKey } from "../../util/ServerPath";

//Types
import {
  SET_ADMIN,
  UNSET_ADMIN,
  UPDATE_PROFILE,
  UPDATE_PROFILE_NAME,
} from "./admin.type";

//Define initialStates
const initialState = {
  isAuth: false,
  user: {},
};

const adminReducer = (state = initialState, action) => {
  let decoded;

  switch (action.type) {
    //Set admin
    case SET_ADMIN:
      if (action.payload) {
        decoded = jwt_decode(action.payload);
      }
      setToken(action.payload);
      setDevKey(devKey);
      localStorage.setItem("token", action.payload);
      localStorage.setItem("key", devKey);
      return {
        ...state,
        isAuth: true,
        user: decoded,
      };

    //unset admin
    case UNSET_ADMIN:
      localStorage.removeItem("token");
      localStorage.removeItem("key");
      setDevKey(null);
      setToken(null);
      return {
        ...state,
        isAuth: false,
        user: {},
      };

    //Update admin Profile
    case UPDATE_PROFILE:
      return {
        ...state,
        user: {
          ...state,
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          image: action.payload.image,
          password: action.payload.password,
          flag: action.payload.flag,
        },
      };

    //Update Admin Name
    case UPDATE_PROFILE_NAME:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

export default adminReducer;
