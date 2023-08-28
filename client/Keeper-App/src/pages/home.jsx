import React, { useState, useEffect } from "react";
import Note from "../components/Note.jsx";
import CreateArea from "../components/CreateArea.jsx";
import { useGetUserID } from "../hooks/useGetUserID.jsx";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigator = useNavigate();
  const userID = useGetUserID();
  const [notes, setNotes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);
  const url = import.meta.env.VITE_note_URL;

  const fetchNotes = async () => {
    try {
      const response = await axios.get(url + `/savedNotes/${userID}`, {
        headers: { authorization: cookies.access_token },
      });
      if (response.data.message) {
        console.log(response.data.message);
        navigator("/auth");
      } else {
        setNotes(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userID) {
      navigator("/auth");
    }
    fetchNotes();
  }, []);

  function addNote(newNote) {
    const saveNote = async () => {
      try {
        const response = await axios.post(url + `/${userID}`, newNote, {
          headers: { authorization: cookies.access_token },
        });
        await axios.put(
          url,
          {
            noteID: response.data._id,
            userID,
          },
          {
            headers: {
              authorization: cookies.access_token,
            },
          }
        );
        setNotes((prevNotes) => {
          return [...prevNotes, response.data];
        });
      } catch (err) {
        console.log(err);
      }
    };
    saveNote();
  }

  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
    const deleteNoteServer = async () => {
      const response = await axios.put(
        url + "/deletedNote",
        {
          userID,
          noteID: this.did,
        },
        { headers: { authorization: cookies.access_token } }
      );
    };
    deleteNoteServer();
  }

  return (
    <div className="container">
      <div className="main">
        <CreateArea onAdd={addNote} />
        {notes.map((noteItem, index) => {
          return (
            <Note
              key={index}
              id={index}
              did={noteItem._id}
              title={noteItem.title}
              content={noteItem.content}
              onDelete={deleteNote}
            />
          );
        })}
      </div>
    </div>
  );
};
