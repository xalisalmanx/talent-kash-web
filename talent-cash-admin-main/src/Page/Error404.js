import React from "react";
import { Link } from "react-router-dom";

//css
import "../assets/css/custom.css";

const Error404 = () => {
  return (
    <div className="error404 text-center">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-4 mr-auto mt-5 text-md-left text-center"></div>
        </div>
      </div>
      <div class="container-fluid error-content">
        <div class="">
          <h1 class="error-number">404</h1>
          <p class="mini-text">Ooops!</p>
          <p class="error-text mb-4 mt-1">
            The page you requested was not found!
          </p>
          <Link to="/" class="btn btn-primary mt-5">
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error404;
