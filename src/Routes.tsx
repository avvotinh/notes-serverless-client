import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./home/home.component";
import Login from "./auth/login/login.component";
import NotFound from "./notFound/notfound.component";
import Signup from "./auth/signup/signup.component";
import CreateNoteContainer from "./note/create/container.component";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/login" component={Login}></Route>
      <Route exact path="/signup" component={Signup}></Route>
      <Route exact path="/notes/create" component={CreateNoteContainer}></Route>
      <Route component={NotFound}></Route>
    </Switch>
  );
}
