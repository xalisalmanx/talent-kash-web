import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//types
import { CLOSE_BANNER_DIALOG } from "../../Store/banner/types";

//action
import { createNewBanner, editBanner } from "../../Store/banner/action";

//bashURL
import { baseURL } from "../../util/ServerPath";

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

const BannerDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.banner);
  const hasPermission = useSelector((state) => state.admin.user.flag);

  const [mongoId, setMongoId] = useState("");
  const [link, setLink] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const [errors, setError] = useState({
    image: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setLink(dialogData.URL);
      // setImagePath(baseURL + dialogData.image);
      setImagePath(dialogData.image);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        image: "",
      });
      setMongoId("");
      setLink("");
      setImageData(null);
      setImagePath(null);
    },
    [open]
  );

  const HandleInputImage = (e) => {
    if (e.target.files[0]) {
      setImageData(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImagePath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const closePopup = () => {
    dispatch({ type: CLOSE_BANNER_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mongoId) {
      if (!imageData || !imagePath) {
        return setError({ ...errors, image: "Banner Image is Required!" });
      }
    } else {
      if (!imageData && !imagePath) {
        return setError({ ...errors, image: "Banner Image is Required!" });
      }
    }

    const formData = new FormData();

    formData.append("image", imageData);
    formData.append("URL", link);
    if (!hasPermission) return permissionError();
    if (mongoId) {
      props.editBanner(mongoId, formData);
    } else {
      props.createNewBanner(formData);
    }
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
          <span className="modal-title font-weight-bold h4"> Banner </span>
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
                  <label className="mb-2 text-gray">Link</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="https://www.google.com"
                    value={link}
                    onChange={(e) => {
                      setLink(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group mt-4">
                  <label className="mb-2 text-gray">Banner Image</label>
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="image/*"
                    required=""
                    onChange={HandleInputImage}
                  />
                  {errors.image && (
                    <div className="ml-2 mt-1">
                      {errors.image && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.image}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {imagePath && (
                    <>
                      <img
                        height="70px"
                        width="70px"
                        alt="app"
                        src={imagePath}
                        style={{
                          boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                          // border: "2px solid #fff",
                          borderRadius: 10,
                          marginTop: 10,
                          float: "left",
                          objectFit: "cover",
                        }}
                      />
                    </>
                  )}
                </div>
                <div className={imagePath ? "mt-5 pt-5" : "mt-5"}>
                  <button
                    type="button"
                    className="btn  ml-2 bg-dark-gradient btn-round float-right   icon_margin"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-round ml-1 float-right banner-button"
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

export default connect(null, { createNewBanner, editBanner })(BannerDialog);
