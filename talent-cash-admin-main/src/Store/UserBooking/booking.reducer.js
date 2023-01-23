import { GET_HISTORY } from "./booking.type";

const initialState = {
  history: {},
  totalIncome: 0,
  totalOutgoing: 0,
  totalUser: 0,
};

const historyReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_HISTORY:
      return {
        ...state,
        history: action.payload.activeBookingList,
        totalIncome: action.payload.income,
        totalOutgoing: action.payload.outgoing,
        totalUser: action.payload.total,
      };

    default:
      return state;
  }
};

export default historyReducer;
