import { GET_REDEEM_REQUEST, REDEEM_ACTION } from "./redeem.type";

const initialState = {
  redeem: [],
  totalRedeem: 0,
};

const redeemReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REDEEM_REQUEST:
      return {
        ...state,
        redeem: action.payload.redeem,
        totalRedeem: action.payload.total,
      };
    case REDEEM_ACTION:
      return {
        ...state,
        redeem: state.redeem.filter((redeem) => redeem._id !== action.payload),
      };
    default:
      return state;
  }
};

export default redeemReducer;
