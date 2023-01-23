import axios from "axios";
import { Toast } from "../../util/Toast";
import { GET_FOLLOWER_FOLLOWING_LIST } from "./follower.type";

export const getFollowerList = (type, userId) => (dispatch) => {
  axios
    .get(`/follower/?type=${type}&userId=${userId}`)
    .then((result) => {
      if (result.data.status) {
        dispatch({
          type: GET_FOLLOWER_FOLLOWING_LIST,
          payload: result.data.user,
        });
      } else {
        Toast("error", result.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};
