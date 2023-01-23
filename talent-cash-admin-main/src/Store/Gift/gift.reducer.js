import {
  CLOSE_GIFT_DIALOG,
  CREATE_GIFT,
  DELETE_GIFT,
  EDIT_GIFT,
  GET_GIFT,
  OPEN_GIFT_DIALOG,
  TOP_GIFT,
} from "./gift.type";

const initialState = {
  gift: [],
  dialog: false,
  dialogData: null,
};

const giftReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GIFT:
      return {
        ...state,
        gift: action.payload,
      };
    case CREATE_GIFT:
      const data = [...state.gift, ...action.payload];
      return {
        ...state,
        gift: data,
      };

    case EDIT_GIFT:
      return {
        ...state,
        gift: state.gift.map((gift) => {
          if (gift._id === action.payload.id) return action.payload.data;
          else return gift;
        }),
      };

    case TOP_GIFT:
      return {
        ...state,
        gift: state.gift.map((gift) => {
          if (gift._id === action.payload._id) {
            return {
              ...gift,
              isTop: action.payload.isTop,
            };
          } else {
            return gift;
          }
        }),
      };

    case DELETE_GIFT:
      return {
        ...state,
        gift: state.gift.filter((gift) => gift._id !== action.payload),
      };
    case OPEN_GIFT_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_GIFT_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default giftReducer;
