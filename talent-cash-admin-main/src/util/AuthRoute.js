//react
import React from "react";

//redux
import { useSelector } from "react-redux";

//react-router-dom
import { Redirect, Route } from "react-router-dom";

const AuthRoute = ({ path, component: Component, ...rest }) => {
  const isAuth = useSelector((state) => state.admin.isAuth);
  return isAuth ? (
    <Redirect to="/admin" />
  ) : (
    <Route path={path} component={Component} {...rest} />
  );
};

export default AuthRoute;
