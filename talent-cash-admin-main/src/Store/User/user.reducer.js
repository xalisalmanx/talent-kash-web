import { BLOCK_USER, EDIT_COIN, GET_USER, GET_USER_LIST } from "./user.type";

const initialState = {
  user: [],
  totalUser: 0,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.payload.user,
        totalUser: action.payload.total,
      };
    case GET_USER_LIST:
      return {
        ...state,
        user: action.payload,
      };

    case BLOCK_USER:
      return {
        ...state,
        user: state.user.map((user) => {
          if (user._id === action.payload._id) {
            return {
              ...user,
              isBlock: action.payload.isBlock,
            };
          } else {
            return user;
          }
        }),
      };
    case EDIT_COIN:
      return {
        ...state,
        user: state.user.map((user) => {
          if (user._id === action.payload.id) return action.payload.data;
          else return user;
        }),
      };

    default:
      return state;
  }
};

export default userReducer;
