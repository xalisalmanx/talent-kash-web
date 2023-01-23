//axios
import axios from "axios";
import { Toast } from "../../util/Toast";

//types
import { SET_ADMIN, UPDATE_PROFILE, UPDATE_PROFILE_NAME } from "./admin.type";

//Login action
export const login = (details) => (dispatch) => {
  axios
    .post("/admin/login", details)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: SET_ADMIN, payload: res.data.token });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch(({ response }) => {
      if (response?.data.message) {
        Toast("error", response.data.message);
      }
    });
};

//Get admin Profile action
export const getProfile = () => (dispatch) => {
  axios
    .get(`/admin`)
    .then((res) => {
      dispatch({ type: UPDATE_PROFILE, payload: res.data.admin });
    })
    .then((error) => {
      console.log(error);
    });
};

//Update Image
export const updateImage = (formData) => (dispatch) => {
  axios
    .patch(`/admin/updateImage`, formData)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: UPDATE_PROFILE, payload: res.data.admin });
        Toast("success", "Image Update Successful ✔");
      } else {
        Toast("error", res.data.message);
      }
    })
    .then((error) => {
      console.log(error);
    });
};

//Update Email and Name
export const updateProfile = (content) => (dispatch) => {
  axios
    .patch(`/admin`, content)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: UPDATE_PROFILE_NAME, payload: res.data.admin });
        Toast("success", " Update Successful ✔");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
