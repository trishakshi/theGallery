require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));

app.use(
  express.json({
    limit: "150mb",
  })
);
app.use(
  cors({
    origin: ["http://localhost:3000", "https://gallerythe.netlify.app"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to galleryDB.");
  }
});

app.use("/auth", require("./routes/UserRoute"));
app.use("/image", require("./routes/ImageRoute"));
