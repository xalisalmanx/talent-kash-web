import React, { useEffect, useState } from "react";

//css
import "../../assets/css/custom.css";

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

//types
import { CLOSE_HASHTAG_DIALOG } from "../../Store/Hashtag/hashtag.type";

//action
import {
  createNewHashtag,
  editHashtag,
} from "../../Store/Hashtag/hashtag.action";
import { baseURL } from "../../util/ServerPath";
import { permissionError } from "../../util/Alert";

const HashtagDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.hashtag);
  const hasPermission = useSelector((state) => state.admin.user.flag);

  const [mongoId, setMongoId] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [description, setDescription] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePath, setCoverImagePath] = useState(null);

  const [errors, setError] = useState({
    hashtag: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setHashtag(dialogData.hashtag);
      setDescription(dialogData.description);
      setImagePath(dialogData.image);
      setCoverImagePath(dialogData.coverImage);
      // setImagePath(baseURL + dialogData.image);
      // setCoverImagePath(baseURL + dialogData.coverImage);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        hashtag: "",
      });
      setMongoId("");
      setHashtag("");
      setDescription("");
      setImageData(null);
      setImagePath(null);
      setCoverImage(null);
      setCoverImagePath(null);
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
  const HandleInputCoverImage = (e) => {
    if (e.target.files[0]) {
      setCoverImage(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCoverImagePath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const closePopup = () => {
    dispatch({ type: CLOSE_HASHTAG_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hashtag.trim())
      return setError({ ...errors, hashtag: "Hashtag is Required!" });
    const formData = new FormData();
    formData.append("image", imageData);
    formData.append("coverImage", coverImage);
    formData.append("hashtag", hashtag);
    formData.append("description", description);

    if (!hasPermission) return permissionError();
    if (mongoId) {
      props.editHashtag(formData, mongoId);
    } else {
      props.createNewHashtag(formData);
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
          <span className="modal-title font-weight-bold h4"> Hashtag </span>
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
                  <label className="mb-2 text-gray">Hashtag</label>
                  {mongoId ? (
                    <input
                      type="text"
                      className="form-control"
                      required=""
                      placeholder="Enter Hashtag"
                      value={hashtag}
                      onChange={(e) => {
                        setHashtag(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            hashtag: "Hashtag is Required!",
                          });
                        } else {
                          return setError({
                            ...errors,
                            hashtag: "",
                          });
                        }
                      }}
                    />
                  ) : (
                    <textarea
                      type="text"
                      rows={3}
                      cols={3}
                      className="form-control"
                      required=""
                      placeholder="Enter Hashtag"
                      value={hashtag}
                      onChange={(e) => {
                        setHashtag(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            hashtag: "Hashtag is Required!",
                          });
                        } else {
                          return setError({
                            ...errors,
                            hashtag: "",
                          });
                        }
                      }}
                    />
                  )}
                  {!mongoId && (
                    <>
                      <span className="text-danger">Note : </span>
                      <span className="text-center text-danger">
                        You can add multiple hashtag separate by comma (,)
                      </span>
                    </>
                  )}
                  {errors.hashtag && (
                    <div className="ml-2 mt-1">
                      {errors.hashtag && (
                        <div className="pl-1 text__left">
                          <span className="" style={{ color: "#009688" }}>
                            {errors.hashtag}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="mb-2 text-gray">description</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="Add Description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mt-4">
                      <label className="mb-2 text-gray">Hashtag Image</label>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept="image/*"
                        required=""
                        onChange={HandleInputImage}
                      />

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
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mt-4">
                      <label className="mb-2 text-gray">
                        Hashtag Cover Image
                      </label>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept="image/*"
                        required=""
                        onChange={HandleInputCoverImage}
                      />

                      {coverImagePath && (
                        <>
                          <img
                            height="70px"
                            width="70px"
                            alt="app"
                            src={coverImagePath}
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

export default connect(null, { createNewHashtag, editHashtag })(HashtagDialog);
