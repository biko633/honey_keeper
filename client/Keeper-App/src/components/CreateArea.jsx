import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";

// TEXTAREA //
function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const [Tbox, setTbox] = useState({
    open: false,
    box: 1,
  });

  function handelBox() {
    setTbox({
      open: true,
      box: 3,
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: "",
    });
    event.preventDefault();
  }

  return (
    <div>
      <form className="create-note">
        {Tbox.open && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}

        <textarea
          name="content"
          onChange={handleChange}
          onClick={handelBox}
          value={note.content}
          placeholder="Take a note..."
          rows={Tbox.box}
        />
        <Zoom in={Tbox.open}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
