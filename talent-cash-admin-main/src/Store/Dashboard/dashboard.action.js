import axios from "axios";
import { GET_DASHBOARD } from "./dashboard.type";

export const getDashboard = (sDate, eDate) => (dispatch) => {
  axios
    .get(`/dashboard?startDate=${sDate}&endDate=${eDate}`)
    .then((result) => {
      dispatch({ type: GET_DASHBOARD, payload: result.data.dashboard });
    })
    .catch((error) => {
      console.log(error);
    });
};
