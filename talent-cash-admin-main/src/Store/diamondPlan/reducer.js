import {
  GET_DIAMOND_PLAN,
  OPEN_DIAMOND_PLAN_DIALOG,
  CLOSE_DIAMOND_PLAN_DIALOG,
  CREATE_NEW_DIAMOND_PLAN,
  EDIT_DIAMOND_PLAN,
  DELETE_DIAMOND_PLAN,
} from "./types";

const initialState = {
  diamondPlan: [],
  dialog: false,
  dialogData: null,
  history: [],
  totalPlan: 0,
};

const diamondPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DIAMOND_PLAN:
      return {
        ...state,
        diamondPlan: action.payload,
      };
    case CREATE_NEW_DIAMOND_PLAN:
      const data = [...state.diamondPlan];
      data.unshift(action.payload);
      return {
        ...state,
        diamondPlan: data,
      };
    case EDIT_DIAMOND_PLAN:
      return {
        ...state,
        diamondPlan: state.diamondPlan.map((diamondPlan) => {
          if (diamondPlan._id === action.payload.id) return action.payload.data;
          else return diamondPlan;
        }),
      };
    case DELETE_DIAMOND_PLAN:
      return {
        ...state,
        diamondPlan: state.diamondPlan.filter(
          (diamondPlan) => diamondPlan._id !== action.payload
        ),
      };
    case OPEN_DIAMOND_PLAN_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_DIAMOND_PLAN_DIALOG:
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

export default diamondPlanReducer;
