const express = require('express'),
  app = express(),
  path = require("path"),
  port = 8080,
  index = require('./routes/index.js'),
  image = require('./routes/image.js');

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use("/", index);
app.use("/image", image);

console.log("App is running on port "+port);

app.listen(process.env.PORT || port);