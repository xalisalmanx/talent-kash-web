import axios from "axios";
import { GET_HISTORY } from "./history.type";

//get history for user
export const getHistory =
  (start, limit, type, sDate, eDate, userId) => (dispatch) => {
    var url;
    if (type === "coin" || type === "diamond") {
      url = `/wallet/historyByAdmin?userId=${userId}&type=${type}&start=${start}&limit=${limit}&startDate=${sDate}&endDate=${eDate}`;
    } else {
      url = `/wallet/history?userId=${userId}&type=${type}&start=${start}&limit=${limit}&startDate=${sDate}&endDate=${eDate}`;
    }
    axios
      .get(url)
      .then((res) => {
        dispatch({
          type: GET_HISTORY,
          payload: {
            history: res.data.history,
            income: res.data.totalIncome,
            outgoing: res.data.totalOutgoing,
            total: res.data.totalUser,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
