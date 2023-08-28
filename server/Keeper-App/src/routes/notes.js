import express from "express";
import { NoteModel } from "../models/Notes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

// GET USERS SAVED NOTES //
router.get("/savedNotes/:userID", verifyToken, async (req, res) => {
  try {
    const notes = await NoteModel.find({ userOwner: req.params.userID });
    res.json(notes);
  } catch (err) {
    res.json(err);
  }
});

//THIS IS GETTING NOTES IDS FROM A USER (NOT IN USE)//
router.get("/savedNotes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json(user.notes);
  } catch (err) {
    res.json(err);
  }
});

//CREATE A NEW NOTE (FOR A USER)//
router.post("/:userID", verifyToken, async (req, res) => {
  console.log(verifyToken);
  const note = new NoteModel({
    title: req.body.title,
    content: req.body.content,
    userOwner: req.params.userID,
  });
  try {
    const response = await note.save();
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

//SAVE THE NOTE TO THE USER//
router.put("/", verifyToken, async (req, res) => {
  try {
    const note = await NoteModel.findById(req.body.noteID);
    const user = await UserModel.findById(req.body.userID);
    user.notes.push(note);
    await user.save();
    res.json({ savedNotes: user.notes });
  } catch (err) {
    res.json(err);
  }
});

//DELETE THE NOTE FROM THE USER AND NOTE MODEL//
router.put("/deletedNote", verifyToken, async (req, res) => {
  try {
    await NoteModel.findByIdAndDelete(req.body.noteID);
    const user = await UserModel.findById(req.body.userID);
    user.notes.pull(req.body.noteID);
    await user.save();
  } catch (err) {
    res.json(err);
  }
});

export { router as notesRouter };
