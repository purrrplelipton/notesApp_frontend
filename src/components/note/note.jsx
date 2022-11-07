import React from "react";

const Note = (props) => {
  const label = props.note.important ? "make not important" : "make important";

  return (
    <div className="note-wrapper">
      <p>{props.note.content}</p>
      <div className="note-controls">
        <button type={'button'} onClick={props.remove}>delete note</button>
        <button type={'button'} onClick={props.clicked}>{label}</button>
      </div>
    </div>
  );
};

export default Note;
