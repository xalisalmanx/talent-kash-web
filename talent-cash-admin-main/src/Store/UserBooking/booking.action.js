import axios from "axios";
import { GET_HISTORY } from "./booking.type";

//get history for user
export const getHistory =
  (start, limit, type,  status ,sDate, eDate, userId) => (dispatch) => {
    var url;
    if (status === 1 && type === 'user') {
      url = `/booking/completedBookingListUser?userId=${userId}&type=${type}&status=${status}&start=${start}&limit=${limit}`;
    } else if(status === 0 && type === 'user') {
      url = `/booking/activeBookingListUser?userId=${userId}&type=${type}&status=${status}&start=${start}&limit=${limit}`;
    }
    else if(status === 0 && type === 'talent_provider') {
      url = `/booking/activeBookingListTalent?talentUserId=${userId}&type=${type}&status=${status}&start=${start}&limit=${limit}`;
    }
    else
    {
      url = `/booking/completedBookingListTalent?talentUserId=${userId}&type=${type}&status=${status}&start=${start}&limit=${limit}`;
    }

    axios
      .get(url)
      .then((res) => {
        dispatch({
          type: GET_HISTORY,
          payload: {
            history: status === 1 && type === 'user' ? res.data.completeBookingList : status === 0 && type === 'user' ? res.data.activeBookingList : status === 0 && type === 'talent_provider' ? res.data.activeBookingList : res.data.completedBookingList,
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
