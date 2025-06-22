const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { db } = require('./db/db');
const Contests=require('./routes/Contest_routes');
const Bookmarks=require('./routes/BookMark_routes');
const Youtubelinks=require('./routes/Youtubelinks_routes')
const app = express();

app.use(express.json());
app.use(cors());
require('dotenv').config();
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use("/api/v1/contest",Contests);
app.use("/api/v1/bookmarks",Bookmarks);
app.use("/api/v1/youtube",Youtubelinks);
const PORT = process.env.PORT;
const server = () => {
  db()
  app.listen(PORT, () => {
      console.log('listening to port:', PORT)
  })
}
server()

