import { API } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/app.context";
import { onError } from "../service/errorHandler.service";
import "./home.styles.scss";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { state } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!state.isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [state.isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes", null);
  }

  function renderNotesList(notes: any) {
    return [{}].concat(notes).map((note: any, i) =>
      i !== 0 ? (
        <Link key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroup.Item>
            <div>{note.content.trim().split("\n")[0]}</div>
            <span>{"Created: " + new Date(note.createdAt).toLocaleString()}</span>
          </ListGroup.Item>
        </Link>
      ) : (
        <Link key="new" to="/notes/create">
          <ListGroup.Item>
            <h4>
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListGroup.Item>
        </Link>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  return <div className="Home">{state.isAuthenticated ? renderNotes() : renderLander()}</div>;
}
