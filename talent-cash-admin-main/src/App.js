//css
import "./bootstrap/css/bootstrap.min.css";
import "./assets/css/plugins.css";
import "./assets/css/structure.css";

import "./assets/css/scrollspyNav.css";

//js
import "./bootstrap/js/bootstrap.min";
import "./bootstrap/js/popper.min";
import "./assets/js/app";
import "./plugins/perfect-scrollbar/perfect-scrollbar.min.js";
import "./assets/js/custom";
// import "./plugins/highlight/highlight.pack.js";
import "./assets/js/scrollspyNav.js";

//component
import Login from "./Page/Login";
import ForgetPassword from "./Page/ForgetPassword";
import AuthRoute from "./util/AuthRoute";

//react-redux-dom
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Admin from "./Page/Admin";
//react-redux
import { useDispatch, useSelector } from "react-redux";

//react
import { useEffect } from "react";

//action
import { SET_ADMIN } from "./Store/Admin/admin.type";

//jquery
import $ from "jquery";

import SessionExpire from "./Page/SessionExpire";
import Error404 from "./Page/Error404";
import ChangePassword from "./Page/ChangePassword";

function App() {
  useEffect(() => {
    $(document).ready(function () {
      App.init();
    });
  }, []);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { isAuth } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!token) {
      return;
    }
    dispatch({ type: SET_ADMIN, payload: token });
  }, [token, dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {isAuth && <Route path="/admin" component={Admin} />}

          <AuthRoute exact path="/" component={Login} />
          <Route exact path="/forget" component={ForgetPassword} />
          <Route exact path="/expire" component={SessionExpire} />
          <Route exact path="/changePassword/:id" component={ChangePassword} />
          <Route path="/" component={Error404} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
