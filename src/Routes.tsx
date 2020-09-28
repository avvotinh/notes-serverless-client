import React from "react";
import { Switch } from "react-router-dom";
import Home from "./home/home.component";
import Login from "./auth/login/login.component";
import NotFound from "./notFound/notfound.component";
import Signup from "./auth/signup/signup.component";
import CreateNoteContainer from "./notes/create/container.component";
import NoteContainer from "./notes/note/container.component";
import UnauthenticatedRoute from "./auth/guard/unauthenticated.route";
import AuthenticatedRoute from "./auth/guard/authenticated.route";

export default function Routes() {
  return (
    <Switch>
      <AuthenticatedRoute exact path="/" component={Home}></AuthenticatedRoute>
      <UnauthenticatedRoute exact path="/login" component={Login}></UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup" component={Signup}></UnauthenticatedRoute>
      <AuthenticatedRoute
        exact
        path="/notes/create"
        component={CreateNoteContainer}
      ></AuthenticatedRoute>
      <AuthenticatedRoute exact path="/notes/:id" component={NoteContainer}></AuthenticatedRoute>
      <AuthenticatedRoute component={NotFound}></AuthenticatedRoute>
    </Switch>
  );
}
