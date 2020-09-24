import React, { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, FormLabel, Form } from "react-bootstrap";

import "./signup.styles.scss";
import { useFormFields } from "../../service/hooks.service";
import { useAppContext } from "../../context/app.context";
import LoaderButton from "../../controls/loaderButton/loaderButton.component";
import { Auth } from "aws-amplify";
import { onError } from "../../service/errorHandler.service";
import { ActionType } from "../../context/app.reducer";

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const history = useHistory();

  const [newUser, setNewUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { state, dispatch } = useAppContext();

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0 && fields.password === fields.confirmPassword;
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      dispatch && dispatch({ type: ActionType.SIGN_IN });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode">
          <FormLabel>Confirmation Code</FormLabel>
          <FormControl autoFocus type="tel" onChange={handleFieldChange} value={fields.confirmationCode} />
          <Form.Text className="text-muted">Please check your email for the code.</Form.Text>
        </FormGroup>
        <LoaderButton block type="submit" isLoading={isLoading} disabled={!validateConfirmationForm()}>
          Verify
        </LoaderButton>
      </form>
    );
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email">
          <FormLabel>Email</FormLabel>
          <FormControl autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl type="password" value={fields.password} onChange={handleFieldChange} />
        </FormGroup>
        <FormGroup controlId="confirmPassword">
          <FormLabel>Confirm Password</FormLabel>
          <FormControl type="password" onChange={handleFieldChange} value={fields.confirmPassword} />
        </FormGroup>
        <LoaderButton block type="submit" isLoading={isLoading} disabled={!validateForm()}>
          Signup
        </LoaderButton>
      </form>
    );
  }

  return <div className="Signup">{newUser === null ? renderForm() : renderConfirmationForm()}</div>;
}
