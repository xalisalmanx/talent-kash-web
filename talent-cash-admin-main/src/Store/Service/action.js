import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  GET_REDEEM_PLAN,
  CREATE_NEW_REDEEM_PLAN,
  EDIT_REDEEM_PLAN,
  DELETE_REDEEM_PLAN,
  CLOSE_REDEEM_PLAN_DIALOG,
} from "./types";

export const getRedeemPlan = () => (dispatch) => {
  axios
    //.get(`redeemPlan`)
    .get(`service/getBackendServices`)
    .then((res) => {
      if (res.data.status) {
        console.log("action", res.data.redeemPlan);
        dispatch({ type: GET_REDEEM_PLAN, payload: res.data.redeemPlan });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const createNewRedeemPlan = (data) => (dispatch) => {
  axios
    .post(`service/getBackendServices`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Record created successfully!");
        dispatch({ type: CLOSE_REDEEM_PLAN_DIALOG });
        dispatch({
          type: CREATE_NEW_REDEEM_PLAN,
          payload: res.data.redeemPlan,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const editRedeemPlan = (redeemPlanId, data) => (dispatch) => {
  axios
    .patch(`service/${redeemPlanId}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Recrod updated successfully!");
        dispatch({ type: CLOSE_REDEEM_PLAN_DIALOG });
        dispatch({
          type: EDIT_REDEEM_PLAN,
          payload: { data: res.data.redeemPlan, id: redeemPlanId },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const deleteRedeemPlan = (redeemPlanId) => (dispatch) => {
  axios
    .delete(`service/${redeemPlanId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_REDEEM_PLAN, payload: redeemPlanId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
