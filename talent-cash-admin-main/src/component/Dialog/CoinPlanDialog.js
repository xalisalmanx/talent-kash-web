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
import { CLOSE_COIN_PLAN_DIALOG } from "../../Store/coinPlan/types";

//action
import { createNewCoinPlan, editCoinPlan } from "../../Store/coinPlan/action";

import $ from "jquery";

const CoinPlanDialog = (props) => {
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

  const { dialog: open, dialogData } = useSelector((state) => state.coinPlan);
  const hasPermission = useSelector((state) => state.admin.user.flag);

  const [mongoId, setMongoId] = useState("");
  const [coin, setCoin] = useState("");
  const [dollar, setDollar] = useState("");
  const [rupee, setRupee] = useState("");
  const [productKey, setProductKey] = useState("");
  const [tag, setTag] = useState("");

  const [errors, setError] = useState({
    coin: "",
    dollar: "",
    rupee: "",
    productKey: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setCoin(dialogData.coin);
      setDollar(dialogData.dollar);
      setRupee(dialogData.rupee);
      setTag(dialogData.tag);
      setProductKey(dialogData.productKey);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        coin: "",
        dollar: "",
        rupee: "",
        productKey: "",
      });
      setMongoId("");
      setCoin("");
      setTag("");
      setDollar("");
      setRupee("");
      setProductKey("");
    },
    [open]
  );

  const closePopup = () => {
    dispatch({ type: CLOSE_COIN_PLAN_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coin || !dollar || !rupee || !productKey) {
      const error = {};

      if (!coin) error.coin = "Diamond is required!";
      if (!dollar) error.dollar = "Dollar is required!";
      if (!rupee) error.rupee = "Rupee is required!";
      if (!productKey) error.productKey = "Product Key is required!";

      return setError({ ...error });
    }

    const diamondValid = isNumeric(coin);
    if (!diamondValid) {
      return setError({ ...errors, coin: "Invalid Diamond!!" });
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
      coin,
      dollar,
      rupee,
      tag,
      productKey,
    };

    if (!hasPermission) return permissionError();
    if (mongoId) {
      props.editCoinPlan(mongoId, data);
    } else {
      props.createNewCoinPlan(data);
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
          <span className="modal-title font-weight-bold h4"> CoinPlan </span>
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
                  <label className="mb-2 text-gray">coin</label>
                  <input
                    type="number"
                    className="form-control"
                    required=""
                    value={coin}
                    placeholder="10"
                    onChange={(e) => {
                      setCoin(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          coin: "coin is Required !",
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
                    <div className="ml-1 mt-1">
                      {errors.coin && (
                        <div className=" text__left">
                          <span className="" style={{ color: "#009688" }}>
                            {errors.coin}
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
                  <label className="mb-2 text-gray">Product Key</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="android.test.purchased"
                    value={productKey}
                    onChange={(e) => {
                      setProductKey(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          productKey: "Product Key is Required !",
                        });
                      } else {
                        return setError({
                          ...errors,
                          productKey: "",
                        });
                      }
                    }}
                  />
                  {errors.productKey && (
                    <div className="ml-1 mt-1">
                      {errors.productKey && (
                        <div className="pl-1 text__left">
                          <span className="" style={{ color: "#009688" }}>
                            {errors.productKey}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
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
                    className="btn btn-round ml-1 float-right  banner-button"
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

export default connect(null, { createNewCoinPlan, editCoinPlan })(
  CoinPlanDialog
);
