import React, { useEffect, useState } from "react";

//image

import boy from "../../assets/img/boy.png";
import girl from "../../assets/img/girl-3.png";

//dayjs
import dayjs from "dayjs";

//css
import "../../assets/css/components/cards/card.css";
import "../../assets/css/custom.css";

//action
import { getUserProfile } from "../../Store/User/user.action";

//react-router-dom
import { Link } from "react-router-dom";

//server path
import { baseURL } from "../../util/ServerPath";

//jquery
import $ from "jquery";

//action
import {
  allowComment,
  getLike,
  getComment,
  deleteComment,
  showProduct,
} from "../../Store/Reels/reel.action";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { permissionError, warning } from "../../util/Alert";
import { useHistory } from "react-router-dom";

const ReelInfo = (props) => {
  const history = useHistory();

  const [allowComment, setAllowComment] = useState(false);
  const [productShow, setProductShow] = useState(false);
  // const [commentCount, setCommentCount] = useState(0);

  const details = JSON.parse(localStorage.getItem("ReelInfo"));

  const like = useSelector((state) => state.reel.like);
  const comment = useSelector((state) => state.reel.comment);
  const hasPermission = useSelector((state) => state.admin.user.flag);

  useEffect(() => {
    props.getLike(details?._id);
    props.getComment(details?._id); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setAllowComment(details?.allowComment);
    setProductShow(details?.isProductShow);
    //  setCommentCount(details?.comment); // eslint-disable-next-line
  }, [details?.allowComment, details?.isProductShow]);
  useEffect(() => {
    setAllowComment(allowComment);
    setProductShow(productShow);
    //  setCommentCount(details?.comment); // eslint-disable-next-line
  }, [allowComment, productShow]);

  let now = dayjs();

  function handleDelete(commentId) {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteComment(commentId);
          // setCommentCount(commentCount - 1);
        }
      })
      .catch((err) => console.log(err));
  }

  //user info
  const handleUserInfo = (user) => {
    localStorage.setItem("user", JSON.stringify(user));

    history.push("/admin/user/userInfo");
  };

  const showLink = () => {
    $("#like").toggleClass("d-none");
    $("#comment").addClass("d-none");
  };
  const showComment = () => {
    $("#comment").toggleClass("d-none");
    $("#like").addClass("d-none");
  };

  const handleAllowComment = (id, value) => {
    if (!hasPermission) return permissionError();
    setAllowComment(!allowComment);
    props.allowComment(id, value);
  };
  const handleProductShow = (id, value) => {
    if (!hasPermission) return permissionError();
    setProductShow(!productShow);
    props.showProduct(id, value);
  };

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing mt-4">
          <div className="row py-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>Reel Details</h4>
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
                    <Link to="/admin/reel"> Reel </Link>
                  </li>
                  <li class="active">
                    <a href="javscript:void(0);">Details</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row mb-4 mt-3 ">
            <div class="card col-md-12 ml-2 mr-2 ">
              <h3 className="mt-3">About Reel</h3>
              <div class="card-body">
                <div className="row">
                  <div class="col-sm-12 col-md-4 col-12">
                    <div
                      class="nav flex-column nav-pills mb-sm-0 mb-3  text-center mx-auto"
                      id="v-border-pills-tab"
                      role="tablist"
                      aria-orientation="vertical"
                    >
                      <div class="user-profile">
                        <video
                          src={ details?.video}
                          controls
                          style={{
                            maxHeight: 500,
                          }}
                          height={700}
                          width="100%"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col-sm-12 col-md-8 col-12">
                    <div class="tab-content" id="v-border-pills-tabContent">
                      <div class="user-info">
                        <div className="d-inline">
                          <div className="row">
                            <div
                              className="col-md-6"
                              onClick={() => handleUserInfo(details?.user)}
                            >
                              <div
                                className="d-inline-block"
                                style={{ cursor: "pointer" }}
                              >
                                <span>
                                  <img
                                    src={
                                      details?.profileImage
                                        ? details?.profileImag
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
                                  {details?.user?.name}
                                </h5>
                                <p class="card-user_occupation ">
                                  {now.diff(details?.createdAt, "minute") <=
                                    60 &&
                                  now.diff(details?.createdAt, "minute") >= 0
                                    ? now.diff(details?.createdAt, "minute") +
                                      " minutes ago"
                                    : now.diff(details?.createdAt, "hour") >= 24
                                    ? dayjs(details?.createdAt).format(
                                        "DD MMM, YYYY"
                                      )
                                    : now.diff(details?.createdAt, "hour") +
                                      " hour ago"}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div
                                className="d-inline-block ml-2 float-right cursor-pointer"
                                style={{ cursor: "pointer" }}
                              >
                                <h5 class="card-user_name d-inline-block ">
                                  Allow Comment
                                </h5>
                                <p class="card-user_occupation ">
                                  <label class="switch s-icons s-outline  s-outline-secondary  mb-4 mr-2 float-center">
                                    <input
                                      type="checkbox"
                                      checked={allowComment}
                                      onClick={() =>
                                        handleAllowComment(
                                          details?._id,
                                          allowComment
                                        )
                                      }
                                    />
                                    <span class="slider round"></span>
                                  </label>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p class="card-text">
                          <table className="table">
                            <tbody>
                              <tr className="border-bottom">
                                <td>Caption</td>
                                <td>:</td>
                                <td>{details?.caption}</td>
                              </tr>
                              <tr className="border-bottom">
                                <td>Location</td>
                                <td>:</td>
                                <td>
                                  {details?.location ? details?.location : "-"}
                                </td>
                              </tr>
                              <tr className="border-bottom">
                                <td>Thumbnail</td>
                                <td>:</td>
                                <td>
                                  <a
                                    href={ details?.thumbnail}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {details?.thumbnail}
                                  </a>
                                </td>
                              </tr>
                              <tr className="border-bottom">
                                <td>Screenshot</td>
                                <td>:</td>
                                <td>
                                  <a
                                    href={details?.screenshot}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {details?.screenshot}
                                  </a>
                                </td>
                              </tr>
                              <tr className="border-bottom">
                                <td>Song</td>
                                <td>:</td>
                                <td>
                                  {details?.isOriginalAudio ? (
                                    "-"
                                  ) : (
                                    <a
                                      href={ details?.song}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {details?.song?.title}
                                    </a>
                                  )}
                                </td>
                              </tr>
                              <tr className="border-bottom">
                                <td>Original Audio?</td>
                                <td>:</td>
                                <td>
                                  {details?.isOriginalAudio ? "true" : "false"}
                                </td>
                              </tr>
                              <tr className="border-bottom">
                                <td>Duration</td>
                                <td>:</td>
                                <td>{details?.duration + " Second"}</td>
                              </tr>
                              <tr className="border-bottom">
                                <td>Video Size</td>
                                <td>:</td>
                                <td>Coming Soon</td>
                              </tr>
                              <tr className="border-bottom">
                                <td>Hashtag</td>
                                <td>:</td>
                                <td>
                                  {details?.hashtag
                                    ?.join(",")
                                    .replace(/['"]+/g, "")}{" "}
                                </td>
                              </tr>
                              <tr className="border-bottom">
                                <td>Mention People</td>
                                <td>:</td>
                                <td>
                                  {details?.mentionPeople
                                    ?.join(",")
                                    .replace(/['"]+/g, "")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class={details?.productUrl ? "row mb-4 mt-3 " : "d-none"}>
            <div class="card col-md-12 ml-2 mr-2 ">
              <h3 className="mt-3">Product Details</h3>
              <div class="card-body">
                <div className="row">
                  <div class="col-sm-12 col-md-4 col-12">
                    <div
                      class="nav flex-column nav-pills mb-sm-0 mb-3  text-center mx-auto"
                      id="v-border-pills-tab"
                      role="tablist"
                      aria-orientation="vertical"
                    >
                      <div class="user-profile">
                        <img src={ details?.productImage} alt="" />
                      </div>
                    </div>
                  </div>

                  <div class="col-sm-12 col-md-8 col-12">
                    <div class="tab-content" id="v-border-pills-tabContent">
                      <div class="user-info">
                        <div className="d-inline">
                          <div className="row">
                            <div
                              className="col-md-6"
                              onClick={() => handleUserInfo(details?.user)}
                            >
                              <div
                                className="d-inline-block"
                                style={{ cursor: "pointer" }}
                              >
                                <span>
                                  <img
                                    src={
                                      details?.profileImage
                                        ? details?.profileImag
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
                                  {details?.user?.name}
                                </h5>
                                <p class="card-user_occupation ">
                                  {now.diff(details?.createdAt, "minute") <=
                                    60 &&
                                  now.diff(details?.createdAt, "minute") >= 0
                                    ? now.diff(details?.createdAt, "minute") +
                                      " minutes ago"
                                    : now.diff(details?.createdAt, "hour") >= 24
                                    ? dayjs(details?.createdAt).format(
                                        "DD MMM, YYYY"
                                      )
                                    : now.diff(details?.createdAt, "hour") +
                                      " hour ago"}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div
                                className="d-inline-block ml-2 float-right cursor-pointer"
                                style={{ cursor: "pointer" }}
                              >
                                <h5 class="card-user_name d-inline-block ">
                                  Show Product
                                </h5>
                                <p class="card-user_occupation ">
                                  <label class="switch s-icons s-outline  s-outline-secondary  mb-4 mr-2 float-center">
                                    <input
                                      type="checkbox"
                                      checked={productShow}
                                      onClick={() =>
                                        handleProductShow(
                                          details?._id,
                                          productShow
                                        )
                                      }
                                    />
                                    <span class="slider round"></span>
                                  </label>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p class="card-text">
                          <table className="table">
                            <tbody>
                              <tr className="border-bottom">
                                <td>URL</td>
                                <td>:</td>
                                <td>{details?.productUrl}</td>
                              </tr>
                              <tr className="border-bottom">
                                <td>Product Tag</td>
                                <td>:</td>
                                <td>
                                  {details?.productTag
                                    ? details?.productTag
                                    : "-"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-4 mt-3 ">
            <div class="card col-md-3 ml-2 ">
              <h3 className="mt-3">Viral Details</h3>
              <div class="card-body">
                <div
                  class="nav flex-column nav-pills mb-sm-0 mb-3  mx-auto"
                  id="v-border-pills-tab"
                  role="tablist"
                  aria-orientation="vertical"
                >
                  <div
                    className="d-inline-block"
                    style={{ cursor: "pointer" }}
                    onClick={showLink}
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
                      class="feather feather-heart"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {"       "}
                    <span
                      className="pl-2 text-white"
                      style={{ fontWeight: 500 }}
                    >
                      Like
                    </span>
                    <span
                      className="pl-2 text-white"
                      style={{ fontWeight: 500 }}
                    >
                      :
                    </span>
                    <span
                      className="pl-2 text-white"
                      style={{ fontWeight: 500 }}
                    >
                      {details?.like}
                    </span>
                  </div>
                </div>
                <div
                  class="nav flex-column nav-pills mb-sm-0   mx-auto mt-3"
                  id="v-border-pills-tab"
                  role="tablist"
                  aria-orientation="vertical"
                >
                  <div
                    className="d-inline-block"
                    style={{ cursor: "pointer" }}
                    onClick={showComment}
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
                      class="feather feather-message-square"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    {"       "}
                    <span
                      className="pl-2 text-white"
                      style={{ fontWeight: 500 }}
                    >
                      Comment
                    </span>
                    <span
                      className="pl-2 text-white"
                      style={{ fontWeight: 500 }}
                    >
                      :
                    </span>
                    <span
                      className="pl-2 text-white"
                      style={{ fontWeight: 500 }}
                    >
                      {comment?.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card col-md-8 ml-md-4 ml-sm-2 d-none" id="like">
              <div class="card-body">
                {like.length > 0 ? (
                  like.map((like) => {
                    return (
                      <div
                        className="mt-2"
                        onClick={() => handleUserInfo(like?.user)}
                      >
                        <div
                          className="d-inline-block"
                          style={{ cursor: "pointer" }}
                        >
                          <span>
                            <img
                              src={like.image ? like.image : girl}
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
                            {like?.name}
                          </h5>
                          <p class="card-user_occupation ">
                            {" "}
                            {like?.time === "0 minutes ago"
                              ? "just now"
                              : like.time}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center">No Data Found</div>
                )}
              </div>
            </div>
            <div className="card col-md-8 ml-md-4 ml-sm-2 d-none" id="comment">
              <div class="card-body">
                {comment.length > 0 ? (
                  comment.map((comment) => {
                    return (
                      <div className="row">
                        <div
                          className="mt-2 col-md-4 col-sm-12 col-12  "
                          onClick={() => handleUserInfo(comment?.user)}
                        >
                          <div
                            className="d-inline-block"
                            style={{ cursor: "pointer" }}
                          >
                            <span>
                              <img
                                src={
                                  comment.image ?  comment.image : boy
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
                              {comment?.name}
                            </h5>
                            <p class="card-user_occupation ">
                              {comment?.time === "0 minutes ago"
                                ? "just now"
                                : comment.time}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 col-md-6 col-sm-12 col-12">
                          <div className="d-inline-block">
                            <span class="text-white ">{comment?.comment}</span>
                          </div>
                          <div className="ml-3 d-inline-block">
                            <i
                              class="far fa-trash-alt html-jquery text-danger"
                              aria-hidden="true"
                              onClick={() => {
                                handleDelete(comment._id);
                              }}
                            ></i>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center">No Data Found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  allowComment,
  getLike,
  getComment,
  deleteComment,
  showProduct,
  getUserProfile,
})(ReelInfo);
