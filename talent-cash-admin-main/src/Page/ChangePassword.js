import React, { useState, useEffect } from "react";
import { Toast } from "../util/Toast";
import { useHistory } from "react-router-dom";

// axios
import axios from "axios";

const ChangePassword = (props) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setId(props.match.params.id);
  }, [props.match.params.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword || password !== confirmPassword) {
      const error = {};

      if (!password) {
        error.password = "Please enter password!";
      }
      if (!confirmPassword) {
        error.confirmPassword = "Please enter confirm password!";
      }
      if (password !== confirmPassword) {
        error.confirmPassword = "Password & Confirm Password does not match";
      }

      return setError({ ...error });
    }
    axios
      .put(`admin/setPassword/${id}`, {
        newPassword: password,
        confirmPassword: confirmPassword,
      })
      .then((res) => {
        if (res.data.status) {
          Toast("success", "password changed successfully!");
          setTimeout(() => {
            props.history.push("/");
          }, 3000);
        } else {
          Toast("error", res.data.message);
        }
      })
      .catch((error) => {
        Toast("error", error.message);
      });
  };
  const eyeFunction = () => {
    const password = document.querySelector("#expire_password");

    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
  };
  return (
    <>
      <div class="form-container outer">
        <div class="form-form">
          <div class="form-form-wrap">
            <div class="form-container">
              <div class="form-content">
                <form class="text-left">
                  <div class="form">
                    <div id="password-field" class="field-wrapper input ">
                      <div class="d-flex justify-content-between">
                        <label for="password">NEW PASSWORD</label>
                      </div>
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
                      </svg>
                      <input
                        id="expire_password"
                        name="password"
                        type="password"
                        class="form-control"
                        placeholder="Password"
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              password: "Please enter password!",
                            });
                          } else {
                            return setError({
                              ...error,
                              password: "",
                            });
                          }
                        }}
                      />
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
                        id="toggle-password"
                        class="feather feather-eye"
                        onClick={eyeFunction}
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <div class="mt-2 ml-2 mb-3">
                        {error.password && (
                          <div class="text-left pb-1">
                            <span className="text-red font-size-lg">
                              {error.password}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div id="password-field" class="field-wrapper input">
                      <div class="d-flex justify-content-between">
                        <label for="password">CONFIRM PASSWORD</label>
                      </div>
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
                      </svg>
                      <input
                        id="expire_password"
                        name="password"
                        type="password"
                        class="form-control"
                        placeholder="Password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              confirmPassword: "Please enter confirm password!",
                            });
                          } else {
                            return setError({
                              ...error,
                              confirmPassword: "",
                            });
                          }
                        }}
                      />
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
                        id="toggle-password"
                        class="feather feather-eye"
                        onClick={eyeFunction}
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <div class="mt-2 ml-2 mb-3">
                        {error.confirmPassword && (
                          <div class=" text-left pb-1">
                            <span className="text-red font-size-lg">
                              {error.confirmPassword}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div class="d-sm-flex justify-content-between">
                      <div class="field-wrapper">
                        <button
                          type="button"
                          class="btn text-white"
                          style={{ backgroundColor: "#D9386A" }}
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
