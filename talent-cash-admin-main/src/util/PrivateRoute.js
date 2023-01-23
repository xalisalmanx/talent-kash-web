//react
import React from "react";

//react-redux
import { useSelector } from "react-redux";

//react-router-dom
import { Route, Redirect } from "react-router-dom";

const PrivateRouter = ({ path, component: Component, ...rest }) => {
  const isAuth = useSelector((state) => state.admin.isAuth);

  return isAuth ? (
    <Route path={path} component={Component} {...rest} />
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRouter;
