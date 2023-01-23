import React, { useState } from "react";

//react-router-dom
import { Link, useHistory } from "react-router-dom";

//css
import "../../assets/css/custom.css";

//server path
import { baseURL } from "../../util/ServerPath";

//jQuery
import $ from "jquery";

//css
import "react-responsive-carousel/lib/styles/carousel.min.css";

//image

import boy from "../../assets/img/boy.png";
import girl from "../../assets/img/girl-3.png";

//inline edit
import EdiText from "react-editext";

//action
import { getFollowerList } from "../../Store/Follower/follower.action";
import { getUserWiseReel } from "../../Store/Reels/reel.action";
import { editCoin } from "../../Store/User/user.action";

//react-redux
import { connect, useSelector } from "react-redux";
import { useEffect } from "react";
import { permissionError } from "../../util/Alert";
import { Toast } from "../../util/Toast";
import axios from "axios";
import { Typography } from "@material-ui/core";
import dayjs from "dayjs";

const UserInfo = (props) => {
  const history = useHistory();

  //jQuery FOR user table
  $(window).resize(function () {
    if ($(window).width() < 670) {
      $("#user-image").removeClass("info-icon");
      $("#user-image").addClass("text-center");
      $("#user-detail").removeClass("text-right");
      $("#user-detail").addClass("text-center");
      $("#user-detail").addClass("mt-3");
      $("#user-info").addClass("text-center");
    } else {
      $("#user-image").addClass("info-icon");
      $("#user-image").removeClass("text-center");
      $("#user-info").removeClass("text-center");
      $("#user-detail").removeClass("text-center");
      $("#user-detail").addClass("text-right");
      $("#user-detail").removeClass("mt-3");
    }
  });

  const detail = JSON.parse(localStorage.getItem("user"));

  const { followersFollowing } = useSelector((state) => state.follower);
  const { reel } = useSelector((state) => state.reel);

  //FOLLOWERS
  const handleFollower = () => {
    $("#follower").toggleClass("d-none");
    $("#reel").addClass("d-none");
    if (!$("#follower").hasClass("d-none")) {
      props.getFollowerList("follower", detail._id);
    }
  };

  //FOLLOWING
  const handleFollowing = () => {
    $("#follower").toggleClass("d-none");
    $("#reel").addClass("d-none");
    if (!$("#follower").hasClass("d-none")) {
      props.getFollowerList("following", detail._id);
    }
  };

  //REEL
  const handleReel = () => {
    $("#reel").toggleClass("d-none");
    $("#follower").addClass("d-none");
    if (!$("#reel").hasClass("d-none")) {
      props.getUserWiseReel(detail._id);
    }
  };

  $(document).ready(() => {
    $("#user-detail").on("click", "a", function () {
      // remove className 'active' from all li who already has className 'active'
      $("#user-detail a.text-white").removeClass("text-white");
      // adding className 'active' to current click li
      $(this).addClass("text-white");
    });
  });

  useEffect(() => {
    props.getUserWiseReel(detail._id); // eslint-disable-next-line
  }, []);

  const handleItem = (data) => {
    localStorage.setItem("ReelInfo", JSON.stringify(data));
    history.push("/admin/reel/reelInfo");
  };

  //user notification
  const [description, setDescription] = useState("");
  const [errors, setError] = useState({
    description: "",
  });
  const hasPermission = useSelector((state) => state.admin.user.flag);

  const [coin, setCoin] = useState();
  const [isCoin, setIsCoin] = useState(false);

  const [diamond, setDiamond] = useState();
  const [isDiamond, setIsDiamond] = useState(false);

  const handleSave = (coin, id, type) => {
    if (!hasPermission) return permissionError();
    const validNumber = /^\d+$/.test(coin);
    if (!validNumber) {
      return Toast("error", "Invalid Value");
    }
    let data;
    if (type === "coin") {
      setIsCoin(true);
      setCoin(coin);
      data = {
        userId: id,
        coin: coin,
      };
    } else {
      setIsDiamond(true);
      setDiamond(coin);
      data = {
        userId: id,
        diamond: coin,
      };
    }
    props.editCoin(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) {
      const errors = {};

      if (!description) {
        errors.description = "Description can't be a blank!";
      }

      return setError({ ...errors });
    }

    if (!hasPermission) return permissionError();

    axios
      .post(`/notification/personalNotification/${detail._id}`)
      .then((res) => {
        if (res.data.data) {
          setError({
            description: "",
          });

          setDescription("");

          Toast("success", "Notification Send Successful");
        } else {
          Toast("error", res.message);
          setDescription("");
        }
      })
      .catch((error) => {
        console.log(error);
        setDescription("");
      });
  };

  const now = dayjs();

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing mt-4">
          <div className="row py-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>User Details</h4>
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
                    <Link to="/admin/user"> User </Link>
                  </li>
                  <li class="active">
                    <a href="javscript:void(0);">Details</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div class="infobox-3">
                <div class="info-icon" id="user-image">
                  <img
                    src={
                      detail?.image
                        ? detail.image
                        : detail?.gender === "female"
                        ? girl
                        : boy
                    }
                    alt=""
                  />
                </div>
                <div id="user-info">
                  <h5 class="info-heading ">{detail?.name}</h5>
                  <p class="info-text">{detail?.username}</p>
                </div>
                <div className="row text-right mr-3" id="user-detail">
                  <div className="col-4">
                    <a
                      class="info-text text-white"
                      id="Reel"
                      href
                      onClick={handleReel}
                    >
                      Short Video
                      <span className="ml-1 ">{`(${detail.reels})`}</span>
                    </a>
                  </div>
                  <div className="col-4">
                    <a
                      class="info-text"
                      id="Follower"
                      href
                      onClick={handleFollower}
                    >
                      Followers
                      <span className="ml-1">{`(${detail.followers})`}</span>
                    </a>
                  </div>
                  <div className="col-4">
                    <a
                      class="info-text"
                      id="Following"
                      href
                      onClick={handleFollowing}
                    >
                      Followings
                      <span className="ml-1">{`(${detail.following})`}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row ">
            <div class="col-md-12 col-lg-5 mt-2">
              <div class="card  text-center align-center" id="table-card">
                <div class="card-body">
                  <h5 class="card-title text-danger">About</h5>
                  <table className="table text-white ">
                    <thead></thead>
                    <tbody className="text-left">
                      <tr>
                        <td>User Id</td>
                        <td>:</td>
                        <td>{detail?.user_id}</td>
                      </tr>
                      <tr>
                        <td>Bio</td>
                        <td>:</td>
                        <td>{detail?.bio}</td>
                      </tr>
                      <tr>
                        <td>Coin</td>
                        <td>:</td>
                        <td>
                          {" "}
                          <EdiText
                            type="text"
                            style={{ backgroundColor: "black" }}
                            value={isCoin ? coin : detail?.coin}
                            onSave={(val) =>
                              handleSave(val, detail?._id, "coin")
                            }
                            className="editClass"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Diamond</td>
                        <td>:</td>
                        <td>
                          {" "}
                          <EdiText
                            type="text"
                            value={isDiamond ? diamond : detail?.diamond}
                            onSave={(val) =>
                              handleSave(val, detail?._id, "diamond")
                            }
                            className="editClass"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Email</td>
                        <td>:</td>
                        <td>{detail?.email}</td>
                      </tr>
                      <tr>
                        <td>Identity</td>
                        <td>:</td>
                        <td>{detail?.identity}</td>
                      </tr>
                      <tr>
                        <td>Login Type</td>
                        <td>:</td>
                        <td>
                          {detail?.loginType === 0
                            ? "Google"
                            : detail?.loginType === 1
                            ? "Facebook"
                            : "Quick"}
                        </td>
                      </tr>
                      <tr>
                        <td>Last Login</td>
                        <td>:</td>
                        <td>{detail?.lastLogin}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="card-footer text-left">
                  <form action="">
                    <label class="float-left">Notification</label>
                    <div class="input-group my-2">
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

                      <div class="input-group-append">
                        <button
                          class="btn bg-primary-gradient text-white"
                          type="button"
                          onClick={handleSubmit}
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
                            class="feather feather-send "
                          >
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-7 my-2 d-none" id="follower">
              <div className="card">
                <div className="card-body">
                  {/* <div className="row ">
                    {followersFollowing?.length > 0 ? (
                      followersFollowing.map((data) => {
                        return (
                          <div className="col-xs-12 col-sm-6">
                            <div className="mt-2">
                              <div
                                className="d-inline-block"
                                style={{ cursor: "pointer" }}
                                data
                              >
                                <span>
                                  <img
                                    src={
                                      data.toUserId?.profileImage
                                        ? data.toUserId?.profileImage
                                        : data.fromUserId?.profileImage
                                        ? data.fromUserId?.profileImage
                                        : boy
                                    }
                                    alt=""
                                    height={50}
                                    width={50}
                                    className=" mb-4"
                                  />
                                </span>
                              </div>
                              <div
                                className="d-inline-block ml-2"
                                style={{ cursor: "pointer" }}
                              >
                                <h5 class="card-user_name d-inline-block ">
                                  {data.toUserId?.name
                                    ? data.toUserId?.name
                                    : data.fromUserId?.name}
                                </h5>
                                <p class="card-user_occupation ">
                                  {" "}
                                  {data.toUserId?.username
                                    ? data.toUserId?.username
                                    : data.fromUserId?.username}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center">No data found</p>
                    )}
                  </div> */}
                  <div
                    class="container followDiv"
                    style={{ maxHeight: 548, overflow: "auto" }}
                  >
                    <div class="row post-comments d-flex flex-wrap justify-content-between">
                      {followersFollowing?.length > 0 ? (
                        followersFollowing.map((data, index) => {
                          return (
                            <div
                              class="col-md-6"
                              style={{
                                paddingRight: "10px",
                                borderRight: `${
                                  followersFollowing.length > 1 &&
                                  index % 2 === 0
                                    ? "1px solid #7d7d83"
                                    : "transparent"
                                }`,
                              }}
                            >
                              <div className="mt-2">
                                <div
                                  className="d-inline-block"
                                  style={{ cursor: "pointer" }}
                                  data
                                >
                                  <span>
                                    <img
                                      src={
                                        data?.toUserId.image
                                          ? data?.toUserId.image
                                          : data?.fromUserId.image
                                          ? data?.fromUserId.image
                                          : boy
                                      }
                                      class="mb-4"
                                      height={50}
                                      width={50}
                                      alt=""
                                    />
                                  </span>
                                </div>
                                <div
                                  className="d-inline-block ml-2"
                                  style={{ cursor: "pointer" }}
                                >
                                  <h6 class=" d-inline-block ">
                                    {data.toUserId?.name
                                      ? data.toUserId?.name
                                      : data.fromUserId?.name}
                                  </h6>
                                  <p class=" ">
                                    {" "}
                                    {data.toUserId?.username
                                      ? data.toUserId?.username
                                      : data.fromUserId?.username}
                                  </p>
                                </div>
                                <div
                                  class="comment-container pointer-cursor"
                                  // onClick={() =>
                                  //   handleUserInfo(
                                  //     data?.toUserId
                                  //       ? data?.toUserId
                                  //       : data?.fromUserId
                                  //   )
                                  // }
                                >
                                  <span class="comment-author">
                                    <small class="comment-date">
                                      {now.diff(data?.createdAt, "minute") <=
                                        60 &&
                                      now.diff(data?.createdAt, "minute") >= 0
                                        ? now.diff(data?.createdAt, "minute") +
                                          " minutes ago"
                                        : now.diff(data?.createdAt, "hour") >=
                                          24
                                        ? dayjs(data?.createdAt).format(
                                            "DD MMM, YYYY"
                                          )
                                        : now.diff(data?.createdAt, "hour") +
                                          " hour ago"}
                                    </small>
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center">Nothing to Show!!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-7 my-2" id="reel">
              <div className="card">
                <div className="row">
                  {reel?.length > 0 ? (
                    reel.map((value) => {
                      return (
                        <div className="col-md-2 my-2 d-flex justify-content-center">
                          <div
                            className="card"
                            onClick={() => handleItem(value)}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={value?.thumbnail}
                              alt=""
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center ml-4 mt-2">No reels found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getFollowerList, getUserWiseReel, editCoin })(
  UserInfo
);
