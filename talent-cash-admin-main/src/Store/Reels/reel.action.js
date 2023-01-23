import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  ALLOW_COMMENT,
  DELETE_COMMENT,
  DELETE_REEL,
  GET_COMMENT,
  GET_LIKE,
  GET_REEL,
  GET_USER_REEL,
  PRODUCT_SHOW,
} from "./reel.type";

//get reels
export const getReel = (page, rowsPerPage, sDate, eDate) => (dispatch) => {
  axios
    .get(
      `/reels?start=${page}&limit=${rowsPerPage}&startDate=${sDate}&endDate=${eDate}`
    )
    .then((result) => {
      dispatch({
        type: GET_REEL,
        payload: { reel: result.data.reel, total: result.data.totalReel },
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
//get user wise reels
export const getUserWiseReel = (userId) => (dispatch) => {
  axios
    .get(`reels/userWiseReel?userId=${userId}`)
    .then((result) => {
      dispatch({ type: GET_USER_REEL, payload: result.data.reel });
    })
    .catch((error) => {
      console.log(error);
    });
};
//get like
export const getLike = (reelId) => (dispatch) => {
  axios
    .get(`/like/?reelId=${reelId}&type=ADMIN`)
    .then((result) => {
      dispatch({ type: GET_LIKE, payload: result.data.like });
    })
    .catch((error) => {
      Toast("error", error.message);
      console.log(error);
    });
};
//get comment
export const getComment = (reelId) => (dispatch) => {
  axios
    .get(`/comment/?reelId=${reelId}&type="ADMIN`)
    .then((result) => {
      dispatch({ type: GET_COMMENT, payload: result.data.comment });
    })
    .catch((error) => {
      Toast("error", error.message);
      console.log(error);
    });
};
//delete comment
export const deleteComment = (commentId) => (dispatch) => {
  axios
    .delete(`/comment/?commentId=${commentId}`)
    .then((result) => {
      dispatch({ type: DELETE_COMMENT, payload: commentId });
      Toast("success", "Delete Comment Successfully");
    })
    .catch((error) => {
      Toast("error", error.message);
      console.log(error);
    });
};
//allow or disallow comment on  reels
export const allowComment = (id, value) => (dispatch) => {
  axios
    .put(`/reels/allowComment/${id}`)
    .then((result) => {
      if (result.data.status) {
        dispatch({ type: ALLOW_COMMENT, payload: result.data.reel });
        if (!value) {
          Toast("success", "Allow Comment On This Reel");
        } else {
          Toast("success", "DisAllow Comment On This Reel");
        }
      }
    })
    .catch((error) => {
      Toast("error", error.message);
      console.log(error);
    });
};

//show product or not
export const showProduct = (id, value) => (dispatch) => {
  axios
    .put(`/reels/showProduct/${id}`)
    .then((result) => {
      if (result.data.status) {
        dispatch({ type: PRODUCT_SHOW, payload: result.data.reel });
        if (!value) {
          Toast("success", "Show Product On This Reel");
        } else {
          Toast("success", "Hidden Product  On This Reel");
        }
      }
    })
    .catch((error) => {
      Toast("error", error.message);
      console.log(error);
    });
};

//delete hashtag
export const deleteReel = (reelId) => (dispatch) => {
  axios
    .delete(`/reels/${reelId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_REEL, payload: reelId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
