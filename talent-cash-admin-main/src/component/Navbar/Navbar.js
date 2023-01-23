/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable  no-script-url */
import React, { useState } from "react";

//image

import boy from "../../assets/img/boy.png";

//react-router-dom
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
//react-redux
import { useDispatch } from "react-redux";

//type
import { UNSET_ADMIN } from "../../Store/Admin/admin.type";

//alert
import { permissionError, warning } from "../../util/Alert";
import { baseURL } from "../../util/ServerPath";
import { appName } from "../../util/ServerPath";
import axios from "axios";

//jquery
import $ from "jquery";

//MUI
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";

import { Toast } from "../../util/Toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { user: admin } = useSelector((state) => state.admin);

  const logout = () => {
    const data = warning();
    data
      .then((logout) => {
        if (logout) {
          dispatch({ type: UNSET_ADMIN });
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  };

  const lockScreen = () => {
    history.push({
      pathname: "/expire",
      state: {
        token: localStorage.getItem("token"),
      },
    });
    localStorage.removeItem("token");
    localStorage.removeItem("key");
  };

  // Notification
  const hasPermission = useSelector((state) => state.admin.user.flag);

  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setError] = useState({
    title: "",
    image: "",
    description: "",
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setError({
      title: "",
      image: "",
      description: "",
      type: "",
    });
    setTitle("");
    setDescription("");
    setImageData(null);
    setImagePath(null);
    $("#file").val("");
  };

  const handleInputImage = (e) => {
    if (e.target.files[0]) {
      setImageData(e.target.files[0]);
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        setImagePath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      const errors = {};

      if (!title) {
        errors.title = "Title can't be a blank!";
      }
      if (!description) {
        errors.description = "Description can't be a blank!";
      }

      if (!imageData || !imagePath) {
        errors.image = "Please select an Image!";
      }

      return setError({ ...errors });
    }

    if (!imageData || !imagePath) {
      return setError({ ...errors, image: "Please select an Image!" });
    }

    setError({ ...errors, image: "" });
    if (!hasPermission) return permissionError();

    const formData = new FormData();
    formData.append("image", imageData);
    formData.append("title", title);
    formData.append("description", description);

    axios
      .post("/notification", formData)
      .then((res) => {
        if (res.data.data === true) {
          setOpen(false);

          setError({
            title: "",
            image: "",
            description: "",
            type: "",
          });
          setTitle("");
          setDescription("");
          setImageData(null);
          setImagePath(null);
          Toast("success", "Notification Send Successful");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div class="header-container fixed-top mt-1">
        <header class="header navbar navbar-expand-sm">
          <ul class="navbar-item theme-brand flex-row  text-center">
            <li class="nav-item theme-logo">
              {/* <a href>
                <img src={logo} class="navbar-logo" alt="logo" />
              </a> */}
              <a href class="sidebarCollapse" data-placement="bottom">
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
                  class="feather feather-menu"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </a>
            </li>
            <li class="nav-item theme-text">
              <a href class="nav-link">
                {" "}
                {/* Your APP Name */}
                {appName}
              </a>
            </li>
          </ul>

          <ul class="navbar-item flex-row ml-md-auto">
            <li class="nav-item dropdown notification-dropdown">
              <a
                href={() => false}
                class="nav-link dropdown-toggle"
                id="notificationDropdown"
                // data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={handleClickOpen}
              >
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
                  class="feather feather-bell"
                  onClick={handleClickOpen}
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span class="badge badge-success"></span>
              </a>
            </li>

            <Dialog
              open={open}
              aria-labelledby="notificationDropdown"
              onClose={handleClose}
              disableBackdropClick
              disableEscapeKeyDown
              fullWidth
              maxWidth="xs"
            >
              <DialogTitle id="notificationDropdown">
                <span className="modal-title">{"Notification"}</span>
              </DialogTitle>

              <IconButton
                style={{
                  position: "absolute",
                  right: 0,
                  color: "#5E72E4",
                }}
              >
                <Tooltip title="Close" className="modal-title">
                  <Cancel onClick={handleClose} />
                </Tooltip>
              </IconButton>
              <DialogContent>
                <div class="modal-body pt-1 px-1 pb-3">
                  <div class="d-flex flex-column text-center">
                    <form>
                      <div class="form-group mt-3">
                        <label class="float-left">Title</label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Title"
                          required
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);

                            if (!e.target.value) {
                              return setError({
                                ...errors,
                                title: "Title can't be a blank!",
                              });
                            } else {
                              return setError({
                                ...errors,
                                title: "",
                              });
                            }
                          }}
                        />
                        {errors.title && (
                          <div class="pl-1 text-left">
                            <Typography variant="caption" color="error">
                              {errors.title}
                            </Typography>
                          </div>
                        )}
                      </div>
                      <div class="form-group">
                        <label class="float-left">Description</label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Description"
                          required
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);

                            if (!e.target.value) {
                              return setError({
                                ...errors,
                                description: "Description can't be a blank!",
                              });
                            } else {
                              return setError({
                                ...errors,
                                description: "",
                              });
                            }
                          }}
                        />
                        {errors.description && (
                          <div class="pl-1 text-left">
                            <Typography variant="caption" color="error">
                              {errors.description}
                            </Typography>
                          </div>
                        )}
                      </div>

                      <div class="form-group">
                        <label class="float-left">Image</label>
                        <input
                          class="form-control"
                          type="file"
                          required=""
                          id="file"
                          onChange={handleInputImage}
                        />
                        {errors.image && (
                          <div class="pl-1 text-left">
                            <Typography variant="caption" color="error">
                              {errors.image}
                            </Typography>
                          </div>
                        )}
                        {imagePath && (
                          <div class="row pl-5">
                            <img
                              src={imagePath}
                              class="mt-3 rounded float-left"
                              height="100px"
                              width="100px"
                            />
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        class="btn text-white bg-primary-gradient btn-round float-right"
                        onClick={handleSubmit}
                      >
                        <i class="fas fa-paper-plane mr-2"></i> Send
                      </button>
                    </form>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <li class="nav-item dropdown user-profile-dropdown">
              <a
                href="javascript:void(0);"
                class="nav-link dropdown-toggle user"
                id="userProfileDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
              >
                <img
                  src={admin.image ? baseURL + admin.image : boy}
                  alt="avatar"
                />
              </a>
              <div
                class="dropdown-menu position-absolute"
                aria-labelledby="userProfileDropdown"
              >
                <div class="">
                  <div class="dropdown-item">
                    <Link
                      class=""
                      to={{
                        pathname: "/admin/profile",
                        state: {
                          dashboard: "Dashboard",
                          parent: "Profile",
                        },
                      }}
                    >
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
                        class="feather feather-user"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>{" "}
                      Profile
                    </Link>
                  </div>
                  {/* <div class="dropdown-item">
                    <a class="" href>
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
                        class="feather feather-inbox"
                      >
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                      </svg>{" "}
                      Inbox
                    </a>
                  </div> */}
                  <div class="dropdown-item">
                    <a class="" href onClick={lockScreen}>
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
                        class="feather feather-lock"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>{" "}
                      Lock Screen
                    </a>
                  </div>
                  <div class="dropdown-item">
                    <a
                      class=""
                      href
                      onClick={logout}
                      style={{ cursor: "pointer" }}
                    >
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
                        class="feather feather-log-out"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>{" "}
                      Logout
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </header>
      </div>
    </>
  );
};

export default Navbar;
