const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const FILE = "./notes.json";

// helper functions
const readNotes = () => {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
};

const writeNotes = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};

//start page
app.get("/", (req, res) => {
  res.json({
    message: "Notes API running 🚀",
    endpoints: {
      getAll: "/notes",
      create: "POST /notes",
      getOne: "/notes/:id",
      update: "PUT /notes/:id",
      delete: "DELETE /notes/:id"
    }
  });
});

// CREATE
app.post("/notes", (req, res) => {
  const notes = readNotes();
  const newNote = {
    id: Date.now(),
    text: req.body.text,
  };
  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});

// READ ALL
app.get("/notes", (req, res) => {
  res.json(readNotes());
});

// READ ONE
app.get("/notes/:id", (req, res) => {
  const notes = readNotes();
  const note = notes.find(n => n.id == req.params.id);
  if (!note) return res.status(404).send("Not found");
  res.json(note);
});

// UPDATE
app.put("/notes/:id", (req, res) => {
  let notes = readNotes();
  notes = notes.map(n =>
    n.id == req.params.id ? { ...n, text: req.body.text } : n
  );
  writeNotes(notes);
  res.send("Updated");
});

// DELETE
app.delete("/notes/:id", (req, res) => {
  let notes = readNotes();
  notes = notes.filter(n => n.id != req.params.id);
  writeNotes(notes);
  res.send("Deleted");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});