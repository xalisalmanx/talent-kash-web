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
import { CLOSE_DIAMOND_PLAN_DIALOG } from "../../Store/diamondPlan/types";

//action
import {
  createNewDiamondPlan,
  editDiamondPlan,
} from "../../Store/diamondPlan/action";

import $ from "jquery";

const DiamondPlanDialog = (props) => {
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

  const { dialog: open, dialogData } = useSelector(
    (state) => state.diamondPlan
  );
  const hasPermission = useSelector((state) => state.admin.user.flag);

  const [mongoId, setMongoId] = useState("");
  const [coin, setCoin] = useState("");
  const [diamond, setDiamond] = useState("");
  const [tag, setTag] = useState("");

  const [errors, setError] = useState({
    coin: "",
    diamond: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setCoin(dialogData.coin);
      setDiamond(dialogData.diamond);
      setTag(dialogData.tag);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        coin: "",
        diamond: "",
      });
      setMongoId("");
      setCoin("");
      setTag("");
      setDiamond("");
    },
    [open]
  );

  const closePopup = () => {
    dispatch({ type: CLOSE_DIAMOND_PLAN_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coin || !diamond) {
      const error = {};

      if (!coin) error.coin = "Coin is required!";
      if (!diamond) error.diamond = "diamond is required!";

      return setError({ ...error });
    }

    if (coin < 0) {
      return setError({ ...errors, coin: "Invalid Coin!!" });
    }
    const coinValid = isNumeric(coin);
    if (!coinValid) {
      return setError({ ...errors, coin: "Invalid Coin!!" });
    }

    if (diamond < 0) {
      return setError({ ...errors, diamond: "Invalid Diamond!!" });
    }
    const diamondValid = isNumeric(diamond);
    if (!diamondValid) {
      return setError({ ...errors, diamond: "Invalid Diamond!!" });
    }

    const data = {
      coin,
      diamond,
      tag,
    };

    if (!hasPermission) return permissionError();
    if (mongoId) {
      props.editDiamondPlan(mongoId, data);
    } else {
      props.createNewDiamondPlan(data);
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
          <span className="modal-title font-weight-bold h4"> DiamondPlan </span>
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mt-4">
                      <label className="mb-2 text-gray">coin</label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        value={coin}
                        placeholder="100"
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
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mt-4">
                      <label className="mb-2 text-gray">Diamond</label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        placeholder="10"
                        value={diamond}
                        onChange={(e) => {
                          setDiamond(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              diamond: "Diamond is Required !",
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
                            <div className="pl-1 text__left">
                              <span className="" style={{ color: "#009688" }}>
                                {errors.diamond}
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

export default connect(null, {
  createNewDiamondPlan,
  editDiamondPlan,
})(DiamondPlanDialog);
