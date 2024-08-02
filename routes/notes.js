const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// Route 1: Get all the notes using GET:'api/notes/fetchallnotes' Loggedin Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error occured");
  }
});

// Route 2: Get all the notes using GET:'api/notes/addnote' Loggedin Required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error occured");
    }
  }
);

// ROUTE 3: Update an Existing Note using : PUT "/api/notes/updatenote". login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //   Create a newNote Object
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }
  
      // find the note to be updated and update it
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found");
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Note Allowed");
      }
  
      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
  
      res.json({ note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error occured");
    }
  });

  // ROUTE 4: Delete an Existing Note using : DELETE "/api/notes/deletenote". login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
  
  
      // find the note to be deleted and delete it
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found");
      }
  
      // Allow deletion only if user owns this Note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Note Allowed");
      }
  
      note = await Note.findByIdAndDelete(req.params.id);
  
      res.json({ Success: "Note has been deleted", note: note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error occured");
    }
  });
  

module.exports = router;
