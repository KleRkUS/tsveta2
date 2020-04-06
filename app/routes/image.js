const express = require('express');
const router = express.Router();
const tf = require("@tensorflow/tfjs");
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
});

const upload = multer({ storage: storage });

const fs = require('fs');
const jpeg = require('jpeg-js');

router.post("/save", upload.fields([{name: 'model.json', maxCount: 1}, {name: 'model.weights.bin', maxCount: 1}]),async (req, res) => {

  res.json("OK");

});

router.get('/load', async (req, res) =>{

  const model = await tf.loadLayersModel('file://uploads/model.json');
  res.send(model);

});

module.exports = router;
