import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  getAdvertisement,
  editAdvertisement,
  showAdvertisement,
} from "../../Store/advertisement/action";

import { permissionError } from "../../util/Alert";

const Advertisement = (props) => {
  const hasPermission = useSelector((state) => state.admin.user.flag);

  const [mongoId, setMongoId] = useState("");
  const [native, setNative] = useState(null);
  const [banner, setBanner] = useState(null);
  const [reward, setReward] = useState(null);
  const [interstitial, setInterstitial] = useState(null);

  const [show, setShow] = useState(false);

  useEffect(() => {
    props.getAdvertisement(); // eslint-disable-next-line
  }, []);

  const google = useSelector((state) => state.advertisement.google);

  useEffect(() => {
    if (google) {
      setMongoId(google?._id);
      setNative(google?.native);
      setBanner(google?.banner);
      setInterstitial(google?.interstitial);
      setReward(google?.reward);
      setShow(google?.show);
    }
  }, [google]);

  const handleSubmit = () => {
    if (!hasPermission) return permissionError();

    const data = {
      native,
      reward,
      interstitial,
      banner,
    };

    props.editAdvertisement(mongoId, data);
  };

  const handleGoogleShow = () => {
    props.showAdvertisement(mongoId);
  };

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing">
          <div className="row py-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>Google Ad</h4>
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
                    <a href="javscript:void(0);">Advertisement</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row mx-3">
            <div class="col">
              <div
                class="card card-md"
                style={
                  {
                    // backgroundColor: "#141B2D",
                    // boxShadow: "2px 2px 2px 2px",
                  }
                }
              >
                <div class="card-body card-overflow">
                  <div className="row">
                    <div className="col-md-6">
                      <h5 class="card-user_name d-inline-block ">Show Ad</h5>
                    </div>
                    <div className="col-md-6 text-right">
                      <label class="switch s-icons s-outline  s-outline-secondary  mb-4 mr-2 float-center">
                        <input
                          type="checkbox"
                          checked={show}
                          onClick={handleGoogleShow}
                        />
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <form>
                    {/* <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="mb-2 text-gray">Native</label>
                          <input
                            type="text"
                            class="form-control"
                            id="native"
                            value={native}
                            onChange={(e) => setNative(e.target.value)}
                          />
                        </div>
                      </div>
                    </div> */}
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="mb-2 text-gray">Reward</label>
                          <input
                            type="text"
                            class="form-control"
                            id="reward"
                            value={reward}
                            onChange={(e) => setReward(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="mb-2 text-gray">Interstitial</label>
                          <input
                            type="text"
                            class="form-control"
                            id="interstitial"
                            value={interstitial}
                            onChange={(e) => setInterstitial(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="mb-2 text-gray">Banner</label>
                          <input
                            type="text"
                            class="form-control"
                            id="banner"
                            value={banner}
                            onChange={(e) => setBanner(e.target.value)}
                          />
                        </div>
                      </div>
                    </div> */}
                    <div className="mt-2">
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

export default connect(null, {
  getAdvertisement,
  editAdvertisement,
  showAdvertisement,
})(Advertisement);
