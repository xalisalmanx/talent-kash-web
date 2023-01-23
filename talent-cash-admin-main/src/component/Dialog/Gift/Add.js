/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from "react";

// routing
import { Link, useHistory } from "react-router-dom";

// react dropzone
import ReactDropzone from "react-dropzone";

// action

import { createNewGift } from "../../../Store/Gift/gift.action";

// redux
import { connect, useSelector } from "react-redux";
import { permissionError } from "../../../util/Alert";

const Add = (props) => {
  const history = useHistory();

  const [coin, setCoin] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setError] = useState({
    image: "",
    coin: "",
  });

  useEffect(() => {
    setError({
      image: "",
      coin: "",
    });

    setCoin("");
    setImages([]);
  }, []);

  const hasPermission = useSelector((state) => state.admin.user.flag);

  const onPreviewDrop = (files) => {
    setError({ ...errors, image: "" });
    files.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setImages(images.concat(files));
  };

  const removeImage = (file) => {
    if (file.preview) {
      const image = images.filter((ele) => {
        return ele.preview !== file.preview;
      });
      setImages(image);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!coin || images.length === 0) {
      const errors = {};

      if (!coin) errors.coin = "Coin is Required!";

      if (images.length === 0) errors.image = "Please select an Image!";

      return setError({ ...errors });
    }

    const coinValid = isNumeric(coin);
    if (!coinValid) {
      return setError({ ...errors, coin: "Invalid Coin!!" });
    }
    const formData = new FormData();

    formData.append("coin", coin);
    for (let i = 0; i < images.length; i++) {
      formData.append("imageVideo", images[i]);
    }

    if (!hasPermission) return permissionError();

    props.createNewGift(formData);
  };

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing">
          <div className="row py-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>Gift Dialog</h4>
            </div>
            <div class="col-xl-6 col-md-6 col-sm-12 col-12 ">
              <div class="breadcrumb-four float-right">
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
                  <li>
                    <Link to="/admin/gift"> Gift </Link>
                  </li>
                  <li class="active">
                    <a href="javscript:void(0);">Add</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-body card-overflow">
                  <div class="d-sm-flex align-items-center justify-content-between mb-4"></div>

                  <form>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="mb-2 text-gray">Coin</label>
                          <input
                            type="number"
                            className="form-control"
                            required=""
                            placeholder="20"
                            value={coin}
                            onChange={(e) => {
                              setCoin(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...errors,
                                  coin: "Coin is Required!",
                                });
                              } else {
                                return setError({
                                  ...errors,
                                  coin: "",
                                });
                              }
                            }}
                          />
                          {errors.coin && (
                            <span style={{ color: "#009688" }}>
                              {errors.coin}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-lg-2">
                        <label
                          className="form-control-label"
                          for="input-username"
                        >
                          Select (Multiple) Image or GIF
                        </label>

                        <>
                          <ReactDropzone
                            onDrop={(acceptedFiles) =>
                              onPreviewDrop(acceptedFiles)
                            }
                            accept="image/*"
                          >
                            {({ getRootProps, getInputProps }) => (
                              <section>
                                <div {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <div
                                    style={{
                                      height: 130,
                                      width: 130,
                                      border: "2px dashed gray",
                                      textAlign: "center",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <i
                                      className="fas fa-plus"
                                      style={{ paddingTop: 30, fontSize: 70 }}
                                    ></i>
                                  </div>
                                </div>
                              </section>
                            )}
                          </ReactDropzone>

                          {errors.image && (
                            <span style={{ color: "#009688" }}>
                              {errors.image}
                            </span>
                          )}
                        </>
                      </div>
                      <div className="col-lg-10 mt-4">
                        {images.length > 0 && (
                          <>
                            {images.map((file, index) => {
                              return (
                                file.type?.split("image")[0] === "" && (
                                  <>
                                    <img
                                      height="60px"
                                      width="60px"
                                      alt="app"
                                      src={file.preview}
                                      style={{
                                        boxShadow:
                                          "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                        border: "2px solid #fff",
                                        borderRadius: 10,
                                        marginTop: 10,
                                        float: "left",
                                        objectFit: "contain",
                                        marginRight: 15,
                                      }}
                                    />
                                    <div
                                      class="img-container"
                                      style={{
                                        display: "inline",
                                        position: "relative",
                                        float: "left",
                                      }}
                                    >
                                      <i
                                        class="fas fa-times-circle text-danger"
                                        style={{
                                          position: "absolute",
                                          right: "10px",
                                          top: "4px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => removeImage(file)}
                                      ></i>
                                    </div>
                                  </>
                                )
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-5">
                      <button
                        type="button"
                        className="btn bg-dark-gradient ml-2 btn-round float-right  icon_margin"
                        onClick={() => {
                          history.push("/admin/gift");
                        }}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className=" btn btn-round ml-1 float-right  banner-button"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { createNewGift })(Add);
