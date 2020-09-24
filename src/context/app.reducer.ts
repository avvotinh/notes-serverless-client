import { StateContext } from "./app.context";

export enum ActionType {
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
}

export type Action = { type: ActionType.SIGN_IN } | { type: ActionType.SIGN_OUT };

export const reducer = (state: StateContext, action: Action) => {
  switch (action.type) {
    case ActionType.SIGN_IN:
      return { ...state, isAuthenticated: true };
    case ActionType.SIGN_OUT:
      return { ...state, isAuthenticated: false };
    default:
      throw new Error("Not among actions");
  }
};
