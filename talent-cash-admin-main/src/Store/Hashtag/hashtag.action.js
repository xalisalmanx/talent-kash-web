import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  CLOSE_HASHTAG_DIALOG,
  CREATE_NEW_HASHTAG,
  DELETE_HASHTAG,
  EDIT_HASHTAG,
  GET_HASHTAG,
} from "./hashtag.type";

//get hashtags
export const getHashtag = () => (dispatch) => {
  axios
    .get("/hashtag")
    .then((result) => {
      if (result.data.status) {
        dispatch({ type: GET_HASHTAG, payload: result.data.hashtag });
      } else {
        Toast("error", result.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//create hashtag
export const createNewHashtag = (data) => (dispatch) => {
  axios
    .post(`/hashtag`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Hashtag created successfully!");
        dispatch({ type: CLOSE_HASHTAG_DIALOG });
        dispatch({ type: CREATE_NEW_HASHTAG, payload: res.data.hashtag });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

//edit hashtag
export const editHashtag = (data, hashtagId) => (dispatch) => {
  axios
    .patch(`/hashtag/${hashtagId}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Hashtag updated successfully!");
        dispatch({ type: CLOSE_HASHTAG_DIALOG });
        dispatch({
          type: EDIT_HASHTAG,
          payload: { data: res.data.hashtag, id: hashtagId },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

//delete hashtag
export const deleteHashtag = (hashtagId) => (dispatch) => {
  axios
    .delete(`/hashtag/${hashtagId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_HASHTAG, payload: hashtagId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
