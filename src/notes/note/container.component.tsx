import React, { useRef, useState, useEffect, FormEvent } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../../service/errorHandler.service";
import "./container.styles.scss";
import awsConfig from "../../aws.config";
import { Form } from "react-bootstrap";
import LoaderButton from "../../controls/loaderButton/loaderButton.component";

export default function NoteContainer() {
  const file = useRef<any>(null);
  const { id }: any = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${id}`, null);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }

  async function handleSubmit(event: FormEvent) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > awsConfig.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${awsConfig.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    setIsLoading(true);
  }

  async function handleDelete(event: any) {
    event.preventDefault();

    const confirmed = window.confirm("Are you sure you want to delete this note?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
  }

  return (
    <div className="Notes">
      {note ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <LoaderButton block type="submit" isLoading={isLoading} disabled={!validateForm()}>
            Save
          </LoaderButton>
          <LoaderButton block onClick={handleDelete} isLoading={isLoading}>
            Delete
          </LoaderButton>
        </Form>
      ) : null}
    </div>
  );
}
