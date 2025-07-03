const express = require("express");
const app = express();

app.use(express.static("prog2"));

app.get("/", (_req, res) => {
  res.redirect("index.html");
});

app.get("/google/:search", (req, res) => {
    res.redirect("https://google.com/search?q=" + req.params.search);
});

app.get("/{*any}", (_req, res) => {
    res.status(404).send("womp womp");
});

app.get("/name/:name", (req, res) => {
    const name = req.params.name;
    res.send("<h1>Hello my good old friend " + name + "!</h1>")
});

app.listen(3000, () => { 
    console.log(`Example app is running on port 3000`); 
});
