import axios from "axios";
import { Toast } from "../../util/Toast";
import { GET_REDEEM_REQUEST, REDEEM_ACTION } from "./redeem.type";

//get reels
export const getRedeem =
  (type, page, rowsPerPage, sDate, eDate, search) => (dispatch) => {
    axios
      .get(
        `/redeem/index?type=${type}&start=${page}&limit=${rowsPerPage}&startDate=${sDate}&endDate=${eDate}&search=${search}`
      )
      .then((result) => {
        dispatch({
          type: GET_REDEEM_REQUEST,
          payload: {
            redeem: result.data.redeem,
            total: result.data.totalRedeem,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

//action for redeem request
export const action = (redeemId, type) => (dispatch) => {
  axios
    .patch(`/redeem/${redeemId}?type=${type}`)
    .then((result) => {
      if (result.status) {
        dispatch({ type: REDEEM_ACTION, payload: redeemId });
        type === "accept"
          ? Toast("success", "Redeem Request Accepted")
          : Toast("success", "Redeem Request Decline");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
