import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { Auth } from "aws-amplify";
import "./login.styles.scss";
import { useAppContext } from "../../context/app.context";
import { ActionType } from "../../context/app.reducer";
import { useHistory } from "react-router-dom";
import LoaderButton from "../../controls/loaderButton/loaderButton.component";
import { onError } from "../../service/errorHandler.service";
import { useFormFields } from "../../service/hooks.service";

export default function Login() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useAppContext();
  const [fields, handleFieldChanged] = useFormFields({
    email: "",
    password: "",
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);

      dispatch && dispatch({ type: ActionType.SIGN_IN });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email">
          <FormLabel>Email</FormLabel>
          <FormControl autoFocus type="email" value={fields.email} onChange={handleFieldChanged} />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl value={fields.password} onChange={handleFieldChanged} type="password" />
        </FormGroup>
        <LoaderButton block type="submit" bsSize="large" isLoading={isLoading} disabled={!validateForm()}>
          Login
        </LoaderButton>
      </form>
    </div>
  );
}
