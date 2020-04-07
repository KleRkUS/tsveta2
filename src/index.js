import FormData from 'form-data'
import axios from 'axios';
const tf = require('@tensorflow/tfjs');


const input = document.getElementById('fileToUpload');
const radiosMode = document.getElementsByName('mode');
const radiosTraining = document.getElementsByName('radio_training');

let modelTraining = false;

let trainingData = [[[[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]]]];

for (let button of radiosMode) {
  button.onclick = () => {
    let mode = button.getAttribute('id');
    if (mode === 'mode_predict') {
      modelTraining = false;
    } else {
      modelTraining = true;
    }
  }
}

for (let button of radiosTraining) {
  button.onclick = () => {
    changeTrainingData(button);
  }
}

input.onchange = e => {

  let tgt = e.target || window.event.srcElement,
    files = tgt.files;

  let rotation = 0;
  document.getElementById('spinner').style.display = "inline-block";

  let timer = setInterval(() => {
    if (rotation == 350) {
      rotation = 5;
    } else {
      rotation += 5;
    }
    document.getElementById('spinner').style.transform = "rotate("+rotation+"deg)";
  }, 20);

  if (FileReader && files && files.length) {
    let fr = new FileReader();
    fr.onload = () => {
      //document.getElementById('outImage').src = fr.result;
      nn(fr.result);
    };
    fr.readAsDataURL(files[0]);
  }
}

function createNN() {
  const model = tf.sequential();

  const flattenLayer = tf.layers.conv2d({
    units: 18000,
    inputShape: [200, 300, 3],
    kernelSize: [200, 300],
    filters: 1,
    dataFormat: "channelsLast",
    activation: "relu"
  });
  model.add(flattenLayer);

  const layer1 = tf.layers.dense({
    units: 2000,
    activation: 'sigmoid',
  });
  model.add(layer1);

  const layer2 = tf.layers.dense({
    units: 100,
    activation: 'sigmoid'
  });
  model.add(layer2);

  return model;
}

async function nn(fr) {

  let load = new Promise(async (res, rej) => {
    const model = await tf.loadLayersModel('http://127.0.0.1:8080/uploads/model.json');
    res(model);
  }).then(async (model) => {
 // const model = createNN();

  let prom = new Promise(async (res, rej) => {

    let obj = new Image(300, 200);
    obj.src = fr;
    res(obj);

  }).then((obj) => {

  //console.log(obj);

  let img = tf.browser.fromPixels(obj);

  let canvas = document.getElementById("canvas");
  tf.browser.toPixels(img, canvas);

  img = img.reshape([-1, 200, 300, 3]);

  //img.print();

  const optimizer = tf.train.sgd(0.1);

  const ys = tf.tensor4d(trainingData);

  model.compile({
    optimizer: optimizer,
    loss: 'meanSquaredError'
  });

  if (modelTraining) {

    console.log(trainingData);
    const his = model.fit(img, ys, {
      epochs: 1000,
    }).then(async res => {
      console.log(res.history.loss);
      const saveRes = await model.save('http://127.0.0.1:8080/image/save').then((res) => {
        console.log(res)
      });
    });
  } else {
    const prediction = model.predict(img);
    draw(prediction);
  }
  });


  //const saveRes = await model.save('file:///model').then((res) => {console.log(res)});
  });
}

function changeTrainingData(elem) {
  const elemId = elem.getAttribute('data-id');
  const rowId = elem.parentElement.getAttribute('data-id');
  const num = String(rowId)+String(elemId);
  let res;

  if (elem.checked) {
    res = 1;
  } else {
    res = 0;
  }

  trainingData[0][0][0][Number(num)] = res;
  return;
}

function draw(prediction) {
  const outCanvas = document.getElementById('outCanvas');
  prediction.array().then(res => {
    let image = res[0][0][0];
    image = image.map((e) => Math.round(e));
    console.log(image);
    let ctx = outCanvas.getContext('2d');
    for (let num = 0; num < image.length; num++) {
      ctx.beginPath();
      let color;
      if (image[num] === 1) {
        ctx.fillStyle = '#000000';
      } else {
        ctx.fillStyle = '#ffffff';
      }
      ctx.fillRect((num % 10)*30, parseInt(num/10)*20, 30, 20);
      console.log(ctx.fillStyle);
      ctx.stroke();
    }
  });
}