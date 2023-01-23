import React, { createRef } from "react";

import Lottie from "react-lottie";
import animationData from "./Loader.json";

// Redux
import { useSelector } from "react-redux";

//css
// import "../assets/css/custom.css";

// MUI
import Dialog from "@material-ui/core/Dialog";

const Spinner = () => {
  const open = useSelector((state) => state.spinner.networkProgressDialog);
  const ref = createRef();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Dialog
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
      PaperComponent="div"
      ref={ref}
      style={{
        background: "transparent",
        boxShadow: "none",
      }}
    >
      <Lottie options={defaultOptions} height={180} width={180} />
    </Dialog>
  );
};

export default React.memo(Spinner);
