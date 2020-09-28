import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAppContext } from "../../context/app.context";

function querystring(name: string, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default function UnauthenticatedRoute({ component: Component, ...rest }: any) {
  const { state } = useAppContext();
  const redirect = querystring("redirect");

  return (
    <Route {...rest}>
      {!state.isAuthenticated ? (
        <Component />
      ) : (
        <Redirect to={redirect === "" || redirect === null ? "/" : redirect} />
      )}
    </Route>
  );
}
