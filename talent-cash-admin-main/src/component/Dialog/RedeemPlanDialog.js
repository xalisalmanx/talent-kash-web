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
import { CLOSE_REDEEM_PLAN_DIALOG } from "../../Store/RedeemPlan/types";

//action
import {
  createNewRedeemPlan,
  editRedeemPlan,
} from "../../Store/RedeemPlan/action";

import $ from "jquery";

const RedeemPlanDialog = (props) => {
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
  const [diamond, setDiamond] = useState("");
  const [dollar, setDollar] = useState("");
  const [rupee, setRupee] = useState("");
  const [tag, setTag] = useState("");

  const [errors, setError] = useState({
    diamond: "",
    dollar: "",
    rupee: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setDiamond(dialogData.diamond);
      setDollar(dialogData.dollar);
      setRupee(dialogData.rupee);
      setTag(dialogData.tag);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        diamond: "",
        dollar: "",
        rupee: "",
      });
      setMongoId("");
      setDiamond("");
      setTag("");
      setDollar("");
      setRupee("");
    },
    [open]
  );

  const closePopup = () => {
    dispatch({ type: CLOSE_REDEEM_PLAN_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diamond || !dollar || !rupee) {
      const error = {};

      if (!diamond) error.diamond = "Diamond is required!";
      if (!dollar) error.dollar = "Dollar is required!";
      if (!rupee) error.rupee = "Rupee is required!";

      return setError({ ...error });
    }

    const diamondValid = isNumeric(diamond);
    if (!diamondValid) {
      return setError({ ...errors, diamond: "Invalid Diamond!!" });
    }

    const dollarValid = isNumeric(dollar);
    if (!dollarValid) {
      return setError({ ...errors, dollar: "Invalid Dollar!!" });
    }

    const rupeeValid = isNumeric(rupee);
    if (!rupeeValid) {
      return setError({ ...errors, rupee: "Invalid Rupee!!" });
    }

    const data = {
      diamond,
      dollar,
      rupee,
      tag,
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
          <span className="modal-title font-weight-bold h4"> RedeemPlan </span>
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
                  <label className="mb-2 text-gray">diamond</label>
                  <input
                    type="number"
                    className="form-control"
                    required=""
                    value={diamond}
                    placeholder="10"
                    onChange={(e) => {
                      setDiamond(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          diamond: "diamond is Required !",
                        });
                      } else {
                        return setError({
                          ...errors,
                          diamond: "",
                        });
                      }
                    }}
                  />
                  {errors.diamond && (
                    <div className="ml-1 mt-1">
                      {errors.diamond && (
                        <div className=" text__left">
                          <span className="" style={{ color: "#009688" }}>
                            {errors.diamond}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mt-4">
                      <label className="mb-2 text-gray">Dollar</label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        placeholder="100"
                        value={dollar}
                        onChange={(e) => {
                          setDollar(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              dollar: "Dollar is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              dollar: "",
                            });
                          }
                        }}
                      />
                      {errors.dollar && (
                        <div className="ml-1 mt-1">
                          {errors.dollar && (
                            <div className="pl-1 text__left">
                              <span className="" style={{ color: "#009688" }}>
                                {errors.dollar}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mt-4">
                      <label className="mb-2 text-gray">Rupee</label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        placeholder="100"
                        value={rupee}
                        onChange={(e) => {
                          setRupee(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              rupee: "Rupee is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              rupee: "",
                            });
                          }
                        }}
                      />
                      {errors.rupee && (
                        <div className="ml-1 mt-1">
                          {errors.rupee && (
                            <div className="pl-1 text__left">
                              <span className="" style={{ color: "#009688" }}>
                                {errors.rupee}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group mt-4">
                  <label className="mb-2 text-gray">Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="20% OFF"
                    value={tag}
                    onChange={(e) => {
                      setTag(e.target.value);
                    }}
                  />
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
  RedeemPlanDialog
);
