import React, { FormEvent, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import awsConfig from "../../aws.config";
import "./container.styles.scss";
import LoaderButton from "../../controls/loaderButton/loaderButton.component";
import { API } from "aws-amplify";
import { onError } from "../../service/errorHandler.service";
import { s3Upload } from "../../service/aws.service";

export default function CreateNoteContainer() {
  const file = useRef<any>(null);
  const history = useHistory();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event: any) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (file.current && file.current.size > awsConfig.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${awsConfig.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      await createNote({ content, attachment });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createNote(note: any) {
    return API.post("notes", "/notes", {
      body: note,
    });
  }

  return (
    <div className="NewNote">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control as="textarea" value={content} onChange={(e) => setContent(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.File id="formcheck-api-regular" onChange={handleFileChange}>
            <Form.File.Label>Attachment</Form.File.Label>
            <Form.File.Input />
          </Form.File>
        </Form.Group>
        <LoaderButton block type="submit" isLoading={isLoading} disabled={!validateForm()}>
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}
