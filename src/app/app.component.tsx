import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import Routes from "../Routes";
import Header from "../shell/header.component";
import "./app.styles.scss";
import { useAppContext } from "../context/app.context";
import { ActionType } from "../context/app.reducer";
import { onError } from "../service/errorHandler.service";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  useEffect(() => {
    onLoad();
  }, []);

  const { dispatch } = useAppContext();

  async function onLoad() {
    try {
      await Auth.currentSession();

      dispatch && dispatch({ type: ActionType.SIGN_IN });
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  return !isAuthenticating ? (
    <BrowserRouter>
      <div className="App container">
        <Header />
        <Routes />
      </div>
    </BrowserRouter>
  ) : null;
}

export default App;
