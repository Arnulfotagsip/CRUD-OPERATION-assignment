const express = require("express");
const fs = require("fs");
const app = express();

let profiles = require("./data.json");

app.use(express.json());

function saveProfiles() {
  fs.writeFileSync("./data.json", JSON.stringify(profiles, null, 2));
}


app.get("/api/profile", (req, res) => {
  res.json(profiles);
});

app.post("/api/profiles", (req, res) => {
  const newProfile = req.body;
  newProfile.id = Date.now();
  profiles.push(newProfile);
  saveProfiles();
  res.status(201).json(newProfile);
});

app.put("/api/profile/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = profiles.findIndex((p) => p.id === id);

  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...req.body };
    saveProfiles();
    res.json(profiles[index]);
  } else {
    res.status(404).json({ message: "Profile not found" });
  }
});

app.delete("/api/profile/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = profiles.findIndex((p) => p.id === id);

  if (index !== -1) {
    const deleted = profiles.splice(index, 1);
    saveProfiles();
    res.json(deleted[0]);
  } else {
    res.status(404).json({ message: "Profile not found" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
