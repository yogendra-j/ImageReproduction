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
    console.log(this.error[0][0]);
  }
  getFitness(dna) {
    this.draw(dna);
    return getError();
  }
  newGeneration() {
    this.error.sort((a, b) => a[0] - b[0]);
    this.updateBest(this.error[0][1]);
    let elites = [];
    for (let i = 0; i < Math.floor(0.05 * this.popSize + 1); i++) {
      elites.push(this.error[i][1]);
    }
    for (let k = 0; k < this.popSize; k++) {
      let mutated = [];
      for (let j = 0; j < this.dense; j++) {
        let mutatedGene;
        if (elites.includes(k)) {
          mutatedGene = this.Population[k][j].copy();
        } else {
          mutatedGene = this.Population[
            elites[Math.floor(Math.random() * elites.length)]
          ][j].copy();
        }
        if (Math.random() > 0.95) {
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
      let mutatedFitness = this.getFitness(mutated);
      // fitnees is actually error
      if (mutatedFitness < this.error[k][0]) {
        this.Population[k] = mutated;
      }
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
      p = new Population(80, 30);
      p.populate();
      setInterval(beginGA, 0);
    };
  };
};

const getError = () => {
  let outImgData = context.getImageData(0, 0, imageW, imageH).data;
  let error = 0;
  for (let i = 0; i < outImgData.length; i++) {
    if (i % 3 !== 0) {
      error += Math.abs(outImgData[i] - inputImgData[i]);
    } else {
      error += Math.abs(outImgData[i] - inputImgData[i]) * 50;
    }
  }
  return error;
};

const beginGA = () => {
  p.newGeneration();
};
