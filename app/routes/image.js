const cocoSsd = require('@tensorflow-models/coco-ssd');
const tf = require('@tensorflow/tfjs');
const upload = require('../commands/uploadMiddleware');
const express = require('express');
const router = express.Router();

router.post("/", upload.single('image'), async (req, res) => {

  const img = req.body.file;

  const image = new ImageData(img);

  res.send(image);
  tf.browser.fromPixels(image).print();


});

module.exports = router;
