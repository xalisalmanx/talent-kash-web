import React, { useEffect, useState } from "react";

import axios from "axios";

//css
import "../assets/css/authentication/form-2.css";

//js
// import "../assets/js/authentication/form-2";

//react-redux
import { connect } from "react-redux";

//action
import { login } from "../Store/Admin/admin.action";

// react-router-dom
import { Link } from "react-router-dom";

const Login = (props) => {
  //State Define
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasAdmin, setHasAdmin] = useState(false);

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  //Submit Functionality
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      const error = {};

      if (!email) {
        error.email = "Email is required !";
      }

      if (!password) {
        error.password = "Password is required !";
      }

      return setError({ ...error });
    }
    const details = {
      email: email,
      password: password,
    };

    props.login(details); // eslint-disable-next-line
  };

  return (
    <>
      <div class="form-container outer">
        <div class="form-form">
          <div class="form-form-wrap">
            <div class="form-container">
              <div class="form-content">
                <h1 class="">Login</h1>
                <p class="">Log in to your account to continue.</p>

                <form class="text-left" autoComplete="off">
                  <div class="form">
                    <div id="username-field" class="field-wrapper input">
                      <label for="username">EMAIL</label>
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
                      </svg>
                      <input
                        autoComplete="off"
                        id="username"
                        name="username"
                        type="text"
                        class="form-control"
                        placeholder="e.g John_Doe@gmail.com"
                        onChange={(e) => {
                          setEmail(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              email: "Email is required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              email: "",
                            });
                          }
                        }}
                      />
                      {error.email && (
                        <span style={{ color: "red" }}>{error.email}</span>
                      )}
                    </div>

                    <div id="password-field" class="field-wrapper input mb-2">
                      <div class="d-flex justify-content-between">
                        <label for="password">PASSWORD</label>
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
                        id="password"
                        name="password"
                        type="password"
                        class="form-control"
                        placeholder="Password"
                        onChange={(e) => {
                          setPassword(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              password: "Password is required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              password: "",
                            });
                          }
                        }}
                      />

                      {error.password && (
                        <span style={{ color: "red" }}>{error.password}</span>
                      )}
                    </div>

                    <div class="d-sm-flex justify-content-between">
                      <div class="field-wrapper">
                        <button
                          type="submit"
                          class="btn text-white bg-primary-gradient"
                          onClick={handleSubmit}
                        >
                          Log In
                        </button>
                      </div>
                    </div>

                    <p class="signup-link">
                      <Link to="/forget" style={{ cursor: "pointer" }}>
                        {" "}
                        Forgot Password?
                      </Link>
                    </p>
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

export default connect(null, { login })(Login);
