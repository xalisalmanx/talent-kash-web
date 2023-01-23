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
import { CLOSE_REDEEM_PLAN_DIALOG } from "../../Store/Service/types";

//action
import {
  createNewRedeemPlan,
  editRedeemPlan,
} from "../../Store/Service/action";

import $ from "jquery";

const AddServiceDialog = (props) => {
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
    const [service_name, setServiceName] = useState("");

  const [errors, setError] = useState({
    // diamond: "",
    // dollar: "",
    // rupee: "",
    service_name: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setServiceName(dialogData.service_name);
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
        service_name: "",
      });
      setMongoId("");
    //   setDiamond("");
    //   setTag("");
    //   setDollar("");
    //   setRupee("");
    setServiceName("");

    },
    [open]
  );

  const closePopup = () => {
    dispatch({ type: CLOSE_REDEEM_PLAN_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!service_name ) {
      const error = {};

      if (!service_name) error.service_name = "Service Name is required!";
    //   if (!iosDownload) error.iosDownload = "IOS Download is required!";

      return setError({ ...error });
    }

    const service_nameValid = service_name;
    if (!service_nameValid) {
      return setError({ ...errors, service_name: "Invalid Service!!" });
    }

    const data = {
      service_name
    };

    if (!hasPermission) return permissionError();
    if (mongoId) {
      props.editRedeemPlan(mongoId, data);
    } else {
      props.createNewRedeemPlan(data);
    }
  };

//   const isNumeric = (value) => {
//     const val = value === "" ? 0 : value;
//     const validNumber = /^\d+$/.test(val);
//     return validNumber;
//   };

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
          <span className="modal-title font-weight-bold h4"> Services </span>
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
                  <label className="mb-2 text-gray">Service Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    value={service_name}
                    placeholder="Enter Service Name"
                    onChange={(e) => {
                      setServiceName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          service_name: "Service Name is Required !",
                        });
                      } else {
                        return setError({
                          ...errors,
                          service_name: "",
                        });
                      }
                    }}
                  />
                  {errors.service_name && (
                    <div className="ml-1 mt-1">
                      {errors.service_name && (
                        <div className=" text__left">
                          <span className="" style={{ color: "#009688" }}>
                            {errors.service_name}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
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
  AddServiceDialog
);
