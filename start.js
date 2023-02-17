"use strict";

const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");

const port = 3000;

const app = express();
app.set("view engine", "ejs");

app.use(cors());

app.use("/", routes);

app.get("/",(req,res)=>{
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`app is running on PORT ${port}`);
});

module.exports = app;