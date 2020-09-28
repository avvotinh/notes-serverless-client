import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/app.context";

export default function AuthenticatedRoute({ component: Component, ...rest }: any) {
  const { pathname, search } = useLocation();
  const { state } = useAppContext();

  return (
    <Route {...rest}>
      {state.isAuthenticated ? (
        <Component />
      ) : (
        <Redirect to={`/login?redirect=${pathname}${search}`} />
      )}
    </Route>
  );
}
