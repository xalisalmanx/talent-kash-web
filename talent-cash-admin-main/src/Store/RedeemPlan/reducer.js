import {
  GET_REDEEM_PLAN,
  OPEN_REDEEM_PLAN_DIALOG,
  CLOSE_REDEEM_PLAN_DIALOG,
  CREATE_NEW_REDEEM_PLAN,
  EDIT_REDEEM_PLAN,
  DELETE_REDEEM_PLAN,
} from "./types";

const initialState = {
  redeemPlan: [],
  appPlan: [],
  dialog: false,
  dialogData: null,
  history: [],
  totalPlan: 0,
};

const RedeemPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REDEEM_PLAN:
      return {
        ...state,
        redeemPlan: action.payload,
      };
    case CREATE_NEW_REDEEM_PLAN:
      const data = [...state.redeemPlan];
      data.unshift(action.payload);
      return {
        ...state,
        redeemPlan: data,
      };
    case EDIT_REDEEM_PLAN:
      return {
        ...state,
        redeemPlan: state.redeemPlan.map((RedeemPlan) => {
          if (RedeemPlan._id === action.payload.id) return action.payload.data;
          else return RedeemPlan;
        }),
      };
    case DELETE_REDEEM_PLAN:
      return {
        ...state,
        redeemPlan: state.redeemPlan.filter(
          (redeemPlan) => redeemPlan._id !== action.payload
        ),
      };
    case OPEN_REDEEM_PLAN_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_REDEEM_PLAN_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    // case GET_COIN_PLAN_HISTORY:
    //   return {
    //     ...state,
    //     history: action.payload.history,
    //     totalPlan: action.payload.total,
    //   };

    default:
      return state;
  }
};

export default RedeemPlanReducer;
