import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//MUI
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { permissionError } from "../../util/Alert";

//types
import { CLOSE_REDEEM_PLAN_DIALOG } from "../../Store/AppDownload/types";

//action
import {
  createNewRedeemPlan,
  editRedeemPlan,
} from "../../Store/AppDownload/action";

import $ from "jquery";

const AddAppDownloadDialog = (props) => {
  // disable mousewheel on a input number field when in focus
  // (to prevent Chromium browsers change the value when scrolling)
  $("form").on("focus", "input[type=number]", function (e) {
    $(this).on("wheel.disableScroll", function (e) {
      e.preventDefault();
    });
  });
  $("form").on("blur", "input[type=number]", function (e) {
    $(this).off("wheel.disableScroll");
  });
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.redeemPlan);
  const hasPermission = useSelector((state) => state.admin.user.flag);

  const [mongoId, setMongoId] = useState("");
//   const [diamond, setDiamond] = useState("");
//   const [dollar, setDollar] = useState("");
//   const [rupee, setRupee] = useState("");
//   const [tag, setTag] = useState("");
    const [androidDownload, setAndroidDownload] = useState("");
    const [iosDownload, setIosDownload] = useState("");

  const [errors, setError] = useState({
    // diamond: "",
    // dollar: "",
    // rupee: "",
    androidDownload: "",
    iosDownload: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setAndroidDownload(dialogData.androidDownload);
      setIosDownload(dialogData.iosDownload);
    //   setRupee(dialogData.rupee);
    //   setTag(dialogData.tag);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        // diamond: "",
        // dollar: "",
        // rupee: "",
        androidDownload: "",
        iosDownload: "",
      });
      setMongoId("");
    //   setDiamond("");
    //   setTag("");
    //   setDollar("");
    //   setRupee("");
    setAndroidDownload("");
    setIosDownload("");

    },
    [open]
  );

  const closePopup = () => {
    dispatch({ type: CLOSE_REDEEM_PLAN_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!androidDownload || !iosDownload ) {
      const error = {};

      if (!androidDownload) error.androidDownload = "Android Download is required!";
      if (!iosDownload) error.iosDownload = "IOS Download is required!";

      return setError({ ...error });
    }

    const androidDownloadValid = isNumeric(androidDownload);
    if (!androidDownloadValid) {
      return setError({ ...errors, androidDownload: "Invalid Diamond!!" });
    }

    const iosDownloadValid = isNumeric(iosDownload);
    if (!iosDownloadValid) {
      return setError({ ...errors, iosDownload: "Invalid Dollar!!" });
    }

    // const rupeeValid = isNumeric(rupee);
    // if (!rupeeValid) {
    //   return setError({ ...errors, rupee: "Invalid Rupee!!" });
    // }

    const data = {
      androidDownload,
      iosDownload
    };

    if (!hasPermission) return permissionError();
    if (mongoId) {
      props.editRedeemPlan(mongoId, data);
    } else {
      props.createNewRedeemPlan(data);
    }
  };

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={closePopup}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">
          <span className="modal-title font-weight-bold h4"> App Download </span>
        </DialogTitle>

        <IconButton
          style={{
            position: "absolute",
            right: 0,
          }}
        >
          <Tooltip title="Close">
            <Cancel className="modal-title" onClick={closePopup} />
          </Tooltip>
        </IconButton>
        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="form-group">
                  <label className="mb-2 text-gray">Android Download</label>
                  <input
                    type="number"
                    className="form-control"
                    required=""
                    value={androidDownload}
                    placeholder="10"
                    onChange={(e) => {
                      setAndroidDownload(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          androidDownload: "Android Download Number is Required !",
                        });
                      } else {
                        return setError({
                          ...errors,
                          androidDownload: "",
                        });
                      }
                    }}
                  />
                  {errors.androidDownload && (
                    <div className="ml-1 mt-1">
                      {errors.androidDownload && (
                        <div className=" text__left">
                          <span className="" style={{ color: "#009688" }}>
                            {errors.androidDownload}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group mt-4">
                      <label className="mb-2 text-gray">IOS Download</label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        placeholder="100"
                        value={iosDownload}
                        onChange={(e) => {
                          setIosDownload(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              iosDownload: "Ios Download Number is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              iosDownload: "",
                            });
                          }
                        }}
                      />
                      {errors.iosDownload && (
                        <div className="ml-1 mt-1">
                          {errors.iosDownload && (
                            <div className="pl-1 text__left">
                              <span className="" style={{ color: "#009688" }}>
                                {errors.iosDownload}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="btn bg-dark-gradient ml-2 btn-round float-right  icon_margin"
                    onClick={closePopup}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default connect(null, { createNewRedeemPlan, editRedeemPlan })(
  AddAppDownloadDialog
);
