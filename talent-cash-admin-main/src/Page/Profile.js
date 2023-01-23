//react
import React, { useEffect, useState } from "react";

//react-router-dom
import { Link, useHistory } from "react-router-dom";

//react-red8ux
import { connect, useDispatch, useSelector } from "react-redux";

//type
import { UNSET_ADMIN } from "../Store/Admin/admin.type";

//baseURL
import { baseURL } from "../util/ServerPath";
//action
import {
  updateProfile,
  getProfile,
  updateImage,
} from "../Store/Admin/admin.action";
//axios
import axios from "axios";
//css
import "../assets/css/users/account-setting.css";
import "../plugins/dropify/dropify.min.css";

//js
import "../assets/js/users/account-settings.js";
import "../plugins/dropify/dropify.min.js";
import "../plugins/blockui/jquery.blockUI.min.js";
import { Toast } from "../util/Toast";
import { permissionError } from "../util/Alert";

const Profile = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState([]);
  const [image, setImage] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [imageFlag, setImageFlag] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  //confirm password error
  const [error, setError] = useState("");

  useEffect(() => {
    props.getProfile();
    setImageFlag(false); // eslint-disable-next-line
  }, []);

  const { user: admin } = useSelector((state) => state.admin);
  const hasPermission = useSelector((state) => state.admin.user.flag);

  useEffect(() => {
    setData(admin);
  }, [admin]);

  useEffect(() => {
    setEmail(data.email);
    setName(data.name);
  }, [data]);

  const imageLoad = (event) => {
    setImage(event.target.files[0]);
    setImagePath(URL.createObjectURL(event.target.files[0]));
    setImageFlag(true);
  };

  //general information update
  const generalInfoUpdate = () => {
    if (!name || !email) {
      const errors = {};
      //for name validation
      if (!name) errors.name = "Name is Require!";
      //for email validation
      if (!email) errors.email = "Email is Require!";

      return setErrors({ ...errors });
    }

    if (!hasPermission) return permissionError();
    if (!imageFlag) {
      const content = {
        name: name,
        email: email,
      };
      props.updateProfile(content); // eslint-disable-next-line
    } else {
      const formData = new FormData();
      formData.append("image", image);
      props.updateImage(formData);
      setImageFlag(false);
    }
  };

  //change password
  const changePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      const errors = {};

      if (!oldPassword) errors.oldPassword = "Require this Filed!";
      if (!newPassword) errors.newPassword = "Require this Filed!";
      if (!confirmPassword) errors.confirmPassword = "Require this Filed!";

      return setErrors({ ...errors });
    }

    setError("");
    if (confirmPassword !== newPassword) {
      return setError("Password & Confirm Password do not match ❌");
    }
    if (!hasPermission) return permissionError();
    axios
      .put(`/admin`, {
        oldPass: oldPassword,
        newPass: newPassword,
        confirmPass: confirmPassword,
      })
      .then((res) => {
        if (res.data.status) {
          Toast("success", "Change Admin Password Successful ✔");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setTimeout(() => {
            dispatch({ type: UNSET_ADMIN });
            history.push("/");
          }, 3000);
        } else {
          Toast("error", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing">
          <div class="breadcrumb-four mt-2 ">
            <ul class="breadcrumb">
              <li>
                <Link to="/admin/dashboard">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-home"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </Link>
              </li>

              <li class="active">
                <a href="javscript:void(0);"> Profile</a>
              </li>
            </ul>
          </div>
          <div class="account-settings-container layout-top-spacing">
            <div class="account-content">
              <div
                class="scrollspy-example"
                data-spy="scroll"
                data-target="#account-settings-scroll"
                data-offset="-100"
              >
                <div class="row">
                  <div class="col-xl-12 col-lg-12 col-md-12 layout-spacing">
                    <form id="general-info" class="section general-info">
                      <div class="info">
                        <div className="row">
                          <div className="col-10">
                            <h6 class="">General Information</h6>
                          </div>
                          <div className="col-2">
                            <button
                              id="add-work-platforms"
                              class="btn text-white bg-submit-gradient "
                              type="button"
                              onClick={generalInfoUpdate}
                            >
                              Update
                            </button>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-lg-11 mx-auto">
                            <div class="row">
                              <div class="col-xl-2 col-lg-12 col-md-4">
                                <div class="upload mt-4 pr-md-4">
                                  <input
                                    type="file"
                                    id="file"
                                    className="d-none"
                                    onChange={imageLoad}
                                  />
                                  <label for="file">
                                    <img
                                      for="file"
                                      src={
                                        imagePath
                                          ? imagePath
                                          : baseURL + data.image
                                      }
                                      alt=""
                                      height={100}
                                      width={100}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </label>

                                  <p class="mt-2">
                                    <i class="flaticon-cloud-upload mr-1"></i>{" "}
                                    <span> Upload Picture</span>
                                  </p>
                                </div>
                              </div>
                              <div class="col-xl-10 col-lg-12 col-md-8 mt-md-0 mt-4">
                                <div class="form">
                                  <div class="row">
                                    <div class="col-sm-12">
                                      <div class="form-group">
                                        <label for="fullName">Full Name</label>
                                        <input
                                          autoComplete="off"
                                          type="text"
                                          class="form-control "
                                          id="fullName"
                                          placeholder="Full Name"
                                          value={name}
                                          onChange={(event) => {
                                            setName(event.target.value);
                                            if (!event.target.value) {
                                              return setErrors({
                                                ...errors,
                                                name: "Name is Required!",
                                              });
                                            } else {
                                              return setErrors({
                                                ...errors,
                                                name: "",
                                              });
                                            }
                                          }}
                                        />
                                        {errors.name && (
                                          <span style={{ color: "#009688" }}>
                                            {errors.name}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div class="form-group">
                                    <label for="profession">Email</label>
                                    <input
                                      autoComplete="off"
                                      type="text"
                                      class="form-control "
                                      id="profession"
                                      placeholder="Designer"
                                      value={email}
                                      onChange={(event) => {
                                        setEmail(event.target.value);
                                        if (!event.target.value) {
                                          return setErrors({
                                            ...errors,
                                            email: "Email is Required!",
                                          });
                                        } else {
                                          return setErrors({
                                            ...errors,
                                            email: "",
                                          });
                                        }
                                      }}
                                    />
                                    {errors.email && (
                                      <span style={{ color: "#009688" }}>
                                        {errors.email}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="col-xl-12 col-lg-12 col-md-12 layout-spacing">
                    <form id="edu-experience" class="section edu-experience">
                      <div class="info">
                        <div className="row">
                          <div className="col-10">
                            <h6 class="">Change Password</h6>
                          </div>
                          <div className="col-2">
                            <button
                              id="add-work-platforms"
                              class="btn text-white bg-submit-gradient"
                              onClick={changePassword}
                              type="button"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-11 mx-auto">
                            <div class="edu-section">
                              <div class="row">
                                <div class="col-md-12">
                                  <div class="form-group">
                                    <label for="degree1">Old Password</label>
                                    <input
                                      type="text"
                                      class="form-control "
                                      id="degree1"
                                      placeholder="Add your old password here..."
                                      onChange={(event) => {
                                        setOldPassword(event.target.value);
                                        if (!event.target.value) {
                                          return setErrors({
                                            ...errors,
                                            oldPassword: "Require this Filed!",
                                          });
                                        } else {
                                          return setErrors({
                                            ...errors,
                                            oldPassword: "",
                                          });
                                        }
                                      }}
                                    />
                                    {errors.oldPassword && (
                                      <span style={{ color: "#009688" }}>
                                        {errors.oldPassword}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div class="col-md-12">
                                  <div class="form-group">
                                    <label for="degree1">New Password</label>
                                    <input
                                      type="text"
                                      class="form-control "
                                      id="degree1"
                                      placeholder="Add your new password here..."
                                      onChange={(event) => {
                                        setNewPassword(event.target.value);
                                        if (!event.target.value) {
                                          return setErrors({
                                            ...errors,
                                            newPassword: "Require this Filed!",
                                          });
                                        } else {
                                          return setErrors({
                                            ...errors,
                                            newPassword: "",
                                          });
                                        }
                                      }}
                                    />
                                    {errors.newPassword && (
                                      <span style={{ color: "#009688" }}>
                                        {errors.newPassword}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div class="col-md-12">
                                  <div class="form-group">
                                    <label for="degree1">
                                      confirm Password
                                    </label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      style={{ backgroundColor: "#141B2D" }}
                                      id="degree1"
                                      placeholder="confirm your new password here..."
                                      // value="Royal Collage of Art Designer Illustrator"
                                      onChange={(event) => {
                                        setConfirmPassword(event.target.value);
                                        if (!event.target.value) {
                                          return setErrors({
                                            ...errors,
                                            confirmPassword:
                                              "Require this Filed!",
                                          });
                                        } else {
                                          return setErrors({
                                            ...errors,
                                            confirmPassword: "",
                                          });
                                        }
                                      }}
                                    />
                                    {errors.confirmPassword && (
                                      <span style={{ color: "#009688" }}>
                                        {errors.confirmPassword}
                                      </span>
                                    )}
                                    {error && (
                                      <span style={{ color: "#009688" }}>
                                        {error}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { updateProfile, updateImage, getProfile })(
  Profile
);
