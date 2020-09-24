import React, { createContext, useContext, useReducer } from "react";
import { Action, reducer } from "./app.reducer";

type Props = {
  children: React.ReactNode;
};

export type StateContext = {
  isAuthenticated: boolean;
};

type AppStore = {
  state: StateContext;
  dispatch?: React.Dispatch<Action>;
};

const initialState: StateContext = {
  isAuthenticated: false,
};

const AppContext = createContext<AppStore>({ state: initialState });

const AppContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

function useAppContext() {
  return useContext(AppContext);
}

export { AppContext, AppContextProvider, useAppContext };
