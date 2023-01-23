import {
  ALLOW_COMMENT,
  DELETE_COMMENT,
  DELETE_REEL,
  GET_COMMENT,
  GET_LIKE,
  GET_REEL,
  GET_USER_REEL,
  PRODUCT_SHOW,
} from "./reel.type";

const initialState = {
  reel: [],
  like: [],
  comment: [],
  totalReel: 0,
};

const reelReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REEL:
      return {
        ...state,
        reel: action.payload.reel,
        totalReel: action.payload.total,
      };
    case GET_USER_REEL:
      return {
        ...state,
        reel: action.payload,
      };
    case GET_COMMENT:
      return {
        ...state,
        comment: action.payload,
      };
    case DELETE_COMMENT:
      return {
        ...state,
        comment: state.comment.filter(
          (comment) => comment._id !== action.payload
        ),
      };
    case GET_LIKE:
      return {
        ...state,
        like: action.payload,
      };
    case ALLOW_COMMENT:
      return {
        ...state,
        reel: state.reel.map((reel) => {
          if (reel._id === action.payload._id) {
            return {
              ...reel,
              allowComment: action.payload.allowComment,
            };
          } else {
            return reel;
          }
        }),
      };
    case PRODUCT_SHOW:
      return {
        ...state,
        reel: state.reel.map((reel) => {
          if (reel._id === action.payload._id) {
            return {
              ...reel,
              isProductShow: action.payload.isProductShow,
            };
          } else {
            return reel;
          }
        }),
      };
    case DELETE_REEL:
      return {
        ...state,
        reel: state.reel.filter((reel) => reel._id !== action.payload),
      };
    default:
      return state;
  }
};

export default reelReducer;
