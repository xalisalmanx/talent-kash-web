import axios from "axios";
import { Toast } from "../../util/Toast";
import { BLOCK_USER, EDIT_COIN, GET_USER, GET_USER_LIST } from "./user.type";
import { baseURL, devKey } from "../../util/ServerPath";

//get users
export const getUser =
  (start, limit, searchValue, sDate, eDate) => (dispatch) => {
    const requestOptions = {
      method: "GET",
      headers: { key: devKey },
    };
    fetch(
      `${baseURL}user?start=${start}&limit=${limit}&search=${searchValue}&startDate=${sDate}&endDate=${eDate}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status)
          dispatch({
            type: GET_USER,
            payload: { user: result.user, total: result.totalUser },
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

//get user without analytic
export const getUser_ = () => (dispatch) => {
  axios
    .get(`/user/user`)
    .then((result) => {
      dispatch({
        type: GET_USER_LIST,
        payload: result.data.user,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//get user profile
export const getUserProfile = (userId) => (dispatch) => {
  axios
    .get(`/user/profile?userId=${userId}`)
    .then((result) => {
      dispatch({ type: GET_USER, payload: result.data.user });
    })
    .catch((error) => {
      console.log(error);
    });
};

//block user
export const isBlock = (mid, value) => (dispatch) => {
  axios
    .put(`/user/${mid}`)
    .then((result) => {
      dispatch({ type: BLOCK_USER, payload: result.data.user });
      if (result.data.status) {
        if (!value) Toast("success", "User Block Successfully ✔");
        else Toast("success", "User UnBlock Successfully ✔");
      } else {
        Toast("error", result.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const editCoin = (data) => (dispatch) => {
  axios
    .post(`/user/addLessCoin`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: EDIT_COIN,
          payload: { data: res.data.user, id: data.userId },
        });
        localStorage.setItem("user", JSON.stringify(res.data.user));
        Toast("success", "Update Successful!!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
