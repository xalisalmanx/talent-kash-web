import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getGift, isTop, deleteGift } from "../../Store/Gift/gift.action";

//config
import { baseURL } from "../../util/ServerPath";
//routing
import { Link, useHistory } from "react-router-dom";

//sweet alert
import { alert, permissionError, warning } from "../../util/Alert";
import { OPEN_GIFT_DIALOG } from "../../Store/Gift/gift.type";
import Edit from "../Dialog/Gift/Edit";

const GiftTable = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [data, setData] = useState([]);

  useEffect(() => {
    props.getGift(); // eslint-disable-next-line
  }, []);

  const gift = useSelector((state) => state.gift.gift);
  const hasPermission = useSelector((state) => state.admin.user.flag);

  useEffect(() => {
    setData(gift);
  }, [gift]);

  //search
  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();
    if (value) {
      const data = gift.filter((data) => {
        return data?.URL?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(data);
    } else {
      return setData(gift);
    }
  };

  const handleDelete = (giftId) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (!hasPermission) return permissionError();
        if (isDeleted) {
          props.deleteGift(giftId);
          alert("Deleted!", `Category has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };
  const handleEdit = (data) => {
    dispatch({ type: OPEN_GIFT_DIALOG, payload: data });
  };
  const handleOpen = () => {
    localStorage.setItem("click", null);
    history.push("/admin/gift/add");
  };
  // //Top Switch
  // const handleTop = (value) => {
  //   props.isTop(value._id, value.isTop);
  // };

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing mt-4">
          <div className="row py-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>Gift </h4>
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

                  <li class="active">
                    <a href="javscript:void(0);"> Gift </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row layout-top-spacing">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
              <button
                type="button"
                className="btn waves-effect waves-light btn text-white text-center bg-primary-gradient  btn-sm float-left"
                onClick={handleOpen}
                id="giftDialog"
              >
                <i className="fa fa-plus mr-1"></i>
                <span className="icon_margin">New</span>
              </button>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right mt-3 mb-3 mt-lg-0 mt-xl-0 filtered-list-search">
              <form class="form-inline my-2 my-lg-0 justify-content-center">
                <div class="w-100">
                  <input
                    type="text"
                    class="w-100 form-control product-search br-30"
                    id="input-search"
                    placeholder="Search Attendees..."
                    onChange={handleSearch}
                  />
                  <button
                    class="btn search-button"
                    type="button"
                    onClick={handleSearch}
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
                      class="feather feather-search"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div class="row layout-top-spacing">
            {data.length > 0 ? (
              data.map((data, index) => {
                return (
                  <div class="col-md-3" key={index}>
                    <div class="card contact-card card-bg pointer-cursor m-2">
                      {/* <div className="card-header text-center">
                        <span className="text-white mr-1">Is Top</span>
                        <span className="text-white mr-1">:</span>
                        <label
                          class="switch s-icons s-outline  s-outline-secondary"
                          style={{ marginBottom: "-0.8rem" }}
                        >
                          <input
                            type="checkbox"
                            checked={data?.isTop}
                            onClick={() => handleTop(data)}
                          />
                          <span class="slider"></span>
                        </label>
                      </div> */}
                      <div class="card-body row">
                        <div className="col-6 text-center">
                          <img
                            src={baseURL + data.image}
                            height={100}
                            width={100}
                            alt=""
                            class="shadow rounded-circle"
                          />
                        </div>
                        <div className="col-6 text-left">
                          <div class="contact-card-info text-white m-2  text-left">
                            <span>{data.coin ? data.coin : "0"} Coins</span>
                          </div>
                          <div class="contact-card-buttons   text-left">
                            <a
                              type="button"
                              class="shadow-none edit-button badge badge-lg  p-2 m-1 d-inline-block"
                              onClick={() => handleEdit(data)}
                              href
                            >
                              <i class="fas fa-edit"></i>
                            </a>

                            <a
                              type="button"
                              class="shadow-none delete-button badge badge-lg  p-2 m-1 d-inline-block"
                              onClick={() => handleDelete(data._id)}
                              href
                            >
                              <i class="fas fa-trash"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" align="center">
                  Nothing to show!!
                </td>
              </tr>
            )}
          </div>
        </div>
      </div>
      <Edit />
    </>
  );
};

export default connect(null, { getGift, isTop, deleteGift })(GiftTable);
