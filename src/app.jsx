import React, { useState, useEffect } from "react";

import Note from "./components/note/note";
import Notification from "./components/notification/notification";
import Footer from "./components/footer/footer";
import noteService from "./services/notes";
import Aux from "./components/hoc/aux";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [noteField, setNoteField] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState({
    success: null,
    message: null,
  });
  const [important, setImportance] = useState("unimportant");

  useEffect(() => {
    noteService
      .getAll()
      .then((dbNotes) => setNotes([...dbNotes]))
      .catch((err) => {
        setErrorMessage({ success: false, message: err.message });
        setTimeout(
          () => setErrorMessage({ success: null, message: null }),
          2800
        );
      });
  }, []);

  const addNote = (event) => {
    event.preventDefault();

    noteService
      .create({
        content: noteField,
        important: important === "important",
      })
      .then((dbNote) => {
        setNotes([...notes, dbNote]);
        setErrorMessage({ success: true, message: "note added" });
        setNoteField("");
        setImportance("unimportant");
        setTimeout(() => {
          setErrorMessage({ success: null, message: null });
        }, 2800);
      })
      .catch((err) => {
        const [, , message] = err.response.data.error.split(/:\s/u);
        setErrorMessage({
          success: false,
          message: message.split(/,\s/u)[0],
        });
        setTimeout(() => {
          setErrorMessage({ success: null, message: null });
        }, 2800);
      });
  };

  const handleNoteFieldChange = (event) => setNoteField(event.target.value);

  const removeNote = (id) => {
    const noteIndex = notes.findIndex((n) => n.id === id);
    const confirm = window.confirm(`delete note № ${noteIndex + 1}?`);
    if (confirm) {
      noteService
        .remove(id)
        .then(() => {
          setNotes([...notes.filter((n) => n.id !== id)]);
          setErrorMessage({
            success: true,
            message: `note № ${noteIndex + 1} has been deleted`,
          });
          setTimeout(
            () => setErrorMessage({ success: null, message: null }),
            2800
          );
        })
        .catch((err) => {
          const [, , message] = err.response.data.error.split(/:\s/u);
          setErrorMessage({
            success: false,
            message: message.split(/,\s/u)[0],
          });
          setTimeout(
            () => setErrorMessage({ success: null, message: null }),
            2800
          );
        });
    } else {
      setErrorMessage({
        success: true,
        message: `declined deleting note ${noteIndex + 1}`,
      });
      setTimeout(() => setErrorMessage({ success: null, message: null }), 2800);
    }
  };

  const importanceHandler = (id) => {
    const note = notes.find((n) => n.id === id),
      noteIndex = notes.findIndex((n) => n.id === id);

    const changedNote = { ...note, important: !note.important };
    noteService
      .update(id, changedNote)
      .then((dbNote) => {
        setNotes(notes.map((n) => (n.id !== id ? n : dbNote)));
        setErrorMessage({
          success: true,
          message: `note № ${noteIndex + 1} ${
            changedNote.important
              ? "is now important"
              : "is no longer important"
          }`,
        });
        setTimeout(
          () => setErrorMessage({ success: null, message: null }),
          2800
        );
      })
      .catch((err) => {
        const [, , message] = err.response.data.error.split(/:\s/u);
        setErrorMessage({
          success: false,
          message: message.split(/,\s/u)[0],
        });
        setTimeout(
          () => setErrorMessage({ success: null, message: null }),
          2800
        );
      });
  };

  const importanceToggle = (value) => setImportance(value);

  const notesToShow = showAll ? notes : notes.filter((n) => n.important);

  return (
    <Aux>
      <h1>Notes List</h1>
      <Notification errorMessage={errorMessage} />
      <button
        className="importance-toggle"
        onClick={() => setShowAll(!showAll)}
        type={"button"}
      >
        show {showAll ? "only important notes" : "all notes"}
      </button>
      <div className="notes-list">
        {notesToShow.map((n) => (
          <Note
            key={n.id}
            note={n}
            remove={() => removeNote(n.id)}
            clicked={() => importanceHandler(n.id)}
          />
        ))}
      </div>
      <form onSubmit={addNote}>
        <textarea
          className="note-field"
          value={noteField}
          placeholder="content"
          onChange={handleNoteFieldChange}
        >
          {noteField}
        </textarea>
        <div className="form-controls">
          <label>
            <input
              type="radio"
              name="importanceToggle"
              value={"important"}
              onChange={(e) => importanceToggle(e.target.value)}
              checked={important === "important"}
            />
            Important
          </label>
          <label>
            <input
              type="radio"
              name="importanceToggle"
              value={"unimportant"}
              onChange={(e) => importanceToggle(e.target.value)}
              checked={important === "unimportant"}
            />
            Unimportant
          </label>
          <button type="submit">save</button>
        </div>
      </form>
      <Footer />
    </Aux>
  );
};

export default App;
