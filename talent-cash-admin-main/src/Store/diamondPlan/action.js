import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  GET_DIAMOND_PLAN,
  CREATE_NEW_DIAMOND_PLAN,
  EDIT_DIAMOND_PLAN,
  DELETE_DIAMOND_PLAN,
  CLOSE_DIAMOND_PLAN_DIALOG,
} from "./types";

export const getDiamondPlan = () => (dispatch) => {
  axios
    .get(`diamondPlan`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_DIAMOND_PLAN, payload: res.data.diamondPlan });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const createNewDiamondPlan = (data) => (dispatch) => {
  axios
    .post(`diamondPlan`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Plan created successfully!");
        dispatch({ type: CLOSE_DIAMOND_PLAN_DIALOG });
        dispatch({
          type: CREATE_NEW_DIAMOND_PLAN,
          payload: res.data.diamondPlan,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const editDiamondPlan = (diamondPlanId, data) => (dispatch) => {
  axios
    .patch(`diamondPlan/${diamondPlanId}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Plan updated successfully!");
        dispatch({ type: CLOSE_DIAMOND_PLAN_DIALOG });
        dispatch({
          type: EDIT_DIAMOND_PLAN,
          payload: { data: res.data.diamondPlan, id: diamondPlanId },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const deleteDiamondPlan = (diamondPlanId) => (dispatch) => {
  axios
    .delete(`diamondPlan/${diamondPlanId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_DIAMOND_PLAN, payload: diamondPlanId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

// export const coinPlanHistory =
//   (id, start, limit, sDate, eDate) => (dispatch) => {
//     const url =
//       id !== null
//         ? `coinPlan/history?userId=${id}&start=${start}&limit=${limit}&startDate=${sDate}&endDate=${eDate}`
//         : `coinPlan/history?start=${start}&limit=${limit}&startDate=${sDate}&endDate=${eDate}`;
//     axios
//       .get(url)
//       .then((res) => {
//         if (res.data.status) {
//           dispatch({
//             type: GET_COIN_PLAN_HISTORY,
//             payload: { history: res.data.history, total: res.data.total },
//           });
//         } else {
//           Toast("error", res.data.message);
//         }
//       })
//       .catch((error) => console.log(error));
//   };
