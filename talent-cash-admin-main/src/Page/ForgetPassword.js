import React, { useState } from "react";

//axios
import axios from "axios";

//toast
import { Toast } from "../util/Toast";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    email: "",
  });

  const handleSubmit = () => {
    if (!email) {
      const error = {};
      if (!email) error.email = "Email Is Required !";

      setError({ ...error });
    } else {
      axios
        .put(`/admin//forgotPassword`, { email })
        .then((result) => {
          if (result.data.status) {
            Toast("success", result.data.message);
          } else {
            Toast("error", result.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          Toast("error", error.message);
        });
    }
  };

  return (
    <>
      <div class="form-container outer">
        <div class="form-form">
          <div class="form-form-wrap">
            <div class="form-container">
              <div class="form-content">
                <h1 class="">Password Recovery</h1>
                <p class="signup-link recovery">
                  Enter your email and instructions will sent to you!
                </p>

                <form class="text-left">
                  <div class="form">
                    <div id="email-field" class="field-wrapper input">
                      <div class="d-flex justify-content-between">
                        <label for="email">EMAIL</label>
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
                        class="feather feather-at-sign"
                      >
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
                      </svg>
                      <input
                        id="email"
                        name="email"
                        type="text"
                        class="form-control"
                        value={email}
                        placeholder="Email"
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

                    <div class="d-sm-flex justify-content-between">
                      <div class="field-wrapper">
                        <button
                          type="button"
                          class="btn text-white"
                          value=""
                          style={{ backgroundColor: "#D9386A" }}
                          onClick={handleSubmit}
                        >
                          Reset
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

export default ForgetPassword;
