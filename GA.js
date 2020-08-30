import { Polygon } from "./elements.js";
const input = document.getElementById("img");
const canvas = document.querySelector("#working");
const context = canvas.getContext("2d");
canvas.width = document.documentElement.clientWidth * 0.32;
canvas.height = canvas.width;
const canvasBest = document.querySelector("#best");
const contextBest = canvasBest.getContext("2d");
canvasBest.width = document.documentElement.clientWidth * 0.32;
canvasBest.height = canvas.width;
const canvasInp = document.querySelector("#input");
const contextInp = canvasInp.getContext("2d");
canvasInp.width = document.documentElement.clientWidth * 0.32;
canvasInp.height = canvas.width;
const downloadLink = document.getElementById("downloadImg");
downloadLink.addEventListener("click", function () {
  this.href = canvas
    .toDataURL("image/jpg")
    .replace("image/jpg", "image/octet-stream");
});
let FitPercent;
let worstError;
let imageW = canvas.width;
let imageH = canvas.height;
let inputImgData;
let p;

class Population {
  constructor(dense, popSize) {
    this.dense = dense;
    this.Population = [];
    this.popSize = popSize;
    this.error = [];
  }
  populate() {
    for (let j = 0; j < this.popSize; j++) {
      let dna = [];
      for (let i = 0; i < this.dense; i++) {
        dna.push(new Polygon(imageW, imageH));
      }
      this.Population.push(dna);
      this.error.push([this.getFitness(dna), j]);
    }
  }

  draw(dna) {
    context.fillStyle = "rgb(255, 255, 255)";
    context.fillRect(0, 0, imageW, imageH);
    dna.forEach((c) => {
      c.draw(context);
    });
  }
  updateBest(k) {
    contextBest.fillStyle = "rgb(255, 255, 255)";
    contextBest.fillRect(0, 0, imageW, imageH);
    this.Population[k].forEach((c) => {
      c.draw(contextBest);
    });
    FitPercent = ((1 - this.error[0][0] / worstError) * 100).toFixed(2);
    document.getElementById("match").textContent = FitPercent;
    console.log(this.error[0][0]);
  }
  getFitness(dna) {
    this.draw(dna);
    return getError();
  }
  newGeneration() {
    this.error.sort((a, b) => a[0] - b[0]);
    this.updateBest(this.error[0][1]);
    for (let k = 0; k < this.popSize; k++) {
      if (k === this.error[0][1]) {
        continue;
      }
      let mutated = [];
      for (let j = 0; j < this.dense; j++) {
        let mutatedGene;
        mutatedGene = this.Population[this.error[0][1]][j].copy();
        if (Math.random() > FitPercent / 100 + 0.1) {
          if (Math.random() > 0.5) {
            //change color
            let prob = Math.random();
            if (prob < 0.25) {
              mutatedGene.color.r = Math.floor(Math.random() * 256);
            } else if (prob < 0.5) {
              mutatedGene.color.g = Math.floor(Math.random() * 256);
            } else if (prob < 0.75) {
              mutatedGene.color.b = Math.floor(Math.random() * 256);
            } else {
              mutatedGene.color.a = Math.random();
            }
          } else {
            //change vertax
            let changeVer = Math.floor(Math.random() * 3);
            Math.random() > 0.5
              ? (mutatedGene.triangle[changeVer].x = Math.random() * imageW)
              : (mutatedGene.triangle[changeVer].y = Math.random() * imageH);
          }
        }

        mutated.push(mutatedGene);
      }
      this.Population[k] = mutated;
    }
    this.error = [];
    for (let j = 0; j < this.popSize; j++) {
      this.error.push([this.getFitness(this.Population[j]), j]);
    }
  }
}
input.onchange = function () {
  let inputImg = input.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(inputImg);
  reader.onload = function (e) {
    let image = new Image();
    image.src = e.target.result;
    image.onload = function (ev) {
      let scale = Math.max(imageW / image.width, imageH / image.height);
      contextInp.drawImage(
        image,
        0,
        0,
        scale * image.width,
        scale * image.height
      );
      inputImgData = contextInp.getImageData(0, 0, imageW, imageH).data;
      worstError = (inputImgData.length / 4) * (255 * 3 + 150);
      console.log(worstError);
      p = new Population(150, 20);
      p.populate();
      setInterval(beginGA, 0);
    };
  };
};

const getError = () => {
  let outImgData = context.getImageData(0, 0, imageW, imageH).data;

  let error = 0;
  for (let i = 0; i < outImgData.length; i += 4) {
    error += Math.abs(outImgData[i] - inputImgData[i]);
    error += Math.abs(outImgData[i + 1] - inputImgData[i + 1]);
    error += Math.abs(outImgData[i + 2] - inputImgData[i + 2]);
    error += Math.abs(outImgData[i + 3] - inputImgData[i + 3]) * 250;
  }
  return error;
};

const beginGA = () => {
  p.newGeneration();
};
