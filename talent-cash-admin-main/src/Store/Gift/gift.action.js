import axios from "axios";

import { Toast } from "../../util/Toast";
import {
  CLOSE_GIFT_DIALOG,
  CREATE_GIFT,
  DELETE_GIFT,
  EDIT_GIFT,
  GET_GIFT,
  TOP_GIFT,
} from "./gift.type";

export const getGift = () => (dispatch) => {
  axios
    .get(`/gift/all`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_GIFT, payload: res.data.gift });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

//is top switch
export const isTop = (mid, value) => (dispatch) => {
  axios
    .put(`/gift/${mid}`)
    .then((result) => {
      dispatch({ type: TOP_GIFT, payload: result.data.gift });
      if (result.data.status) {
        if (!value) Toast("success", "Gift Set Top Successfully ✔");
        else Toast("success", "Gift Unset Top Successfully ✔");
      } else {
        Toast("error", result.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
//create new gift
export const createNewGift = (data) => (dispatch) => {
  axios
    .post(`/gift`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Gift created successfully!");

        dispatch({ type: CREATE_GIFT, payload: res.data.gift });
        setInterval(() => {
          window.location.href = "/admin/gift";
        }, 3000);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

//delete gift
export const deleteGift = (giftId) => (dispatch) => {
  axios
    .delete(`/gift/${giftId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_GIFT, payload: giftId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

//edit gift
export const editGift = (giftId, data) => (dispatch) => {
  axios
    .patch(`/gift/${giftId}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Gift updated successfully!");
        dispatch({ type: CLOSE_GIFT_DIALOG });
        dispatch({
          type: EDIT_GIFT,
          payload: { data: res.data.gift, id: giftId },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
