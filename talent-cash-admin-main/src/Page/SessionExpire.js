import React, { useEffect, useState } from "react";

import { baseURL, devKey } from "../util/ServerPath";

import { Toast } from "../util/Toast";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import bcrypt from "bcryptjs";

const SessionExpire = (props) => {
  const { user } = useSelector((state) => state.admin);

  const history = useHistory();

  const [Password, setPassword] = useState("");
  var validation;
  useEffect(() => {
    validation = bcrypt.compareSync(Password, user.password);
  }, [Password]);

  const login = () => {
    if (validation) {
      localStorage.setItem("token", props.location.state.token);
      localStorage.setItem("key", devKey);
      history.push("/admin");
    } else {
      Toast("error", "Your Password is Wrong");
    }
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
                <div class="d-flex user-meta">
                  <img
                    src={baseURL + user?.image}
                    class="usr-profile"
                    alt="avatar"
                  />
                  <div class="">
                    <p class="">{user?.name}</p>
                  </div>
                </div>

                <form class="text-left">
                  <div class="form">
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
                        id="expire_password"
                        name="password"
                        type="password"
                        class="form-control"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
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
                    </div>
                    <div class="d-sm-flex justify-content-between">
                      <div class="field-wrapper">
                        <button
                          type="button"
                          className="btn bg-primary-gradient text-white"
                          onClick={login}
                        >
                          Unlock
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

export default SessionExpire;
