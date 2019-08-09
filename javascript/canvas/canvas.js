// 获取页面中的元素
const canvas = document.getElementById('canvas');
const color = document.getElementById('color');
const lineWidth = document.getElementById('lineWidth');
const operations = document.getElementById('operations');
const imageFile = document.getElementById('imageFile');
const downloadLink = document.getElementById('downloadLink');

const elements = {
  canvas,
  color,
  lineWidth,
  operations,
  imageFile,
  downloadLink
};

class Draw {
  constructor (elements) {
    const { canvas, color, lineWidth, operations, imageFile, downloadLink } = elements;
    this.type = 'pencil';
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.isDrawing = false;
    this.color = color;
    this.lineWidth = lineWidth;
    this.operations = operations;
    this.imageFile = imageFile;
    this.image = new Image();
    this.downloadLink = downloadLink;
  }
  init () {
    let originX = null;
    let originY = null;
    this.operations.addEventListener('click', (event) => {
      const handleClick = this.handleOperations();
      const handleCurrentClick = handleClick[event.target.id];
      handleCurrentClick && handleCurrentClick();
    }, false);
    this.canvas.addEventListener('mousedown', (event) => {
      this.isDrawing = true;
      this.image.src = this.canvas.toDataURL('image/png');

      const { clientX, clientY } = event;
      const { offsetLeft, offsetTop } = this.canvas;
      originX = clientX - offsetLeft;
      originY = clientY - offsetTop;
      this.context.moveTo(originX, originY);
      this.context.lineWidth = this.lineWidth.value;
      this.context.beginPath();
    }, false);
    this.canvas.addEventListener('mouseleave', () => { this.endOfDrawing(); }, false);
    this.canvas.addEventListener('mouseup', () => { this.endOfDrawing(); }, false);
    this.canvas.addEventListener('mousemove', () => {
      if (this.isDrawing) {
        const { clientX, clientY } = event;
        const { offsetLeft, offsetTop } = this.canvas;
        const x = clientX - offsetLeft;
        const y = clientY - offsetTop;

        if (this.type === 'pencil') {
          this.context.lineTo(x, y);
          this.context.stroke();
        }
        if (this.type === 'eraser') {
          this.context.strokeStyle = '#ccc';
          this.context.clearRect(x-10,y-10,20,20);
        }

        let newOriginX = originX, newOriginY = originY;
        if (this.type === 'straightLine') {
          this.context.clearRect(0,0,800,800);
          this.context.drawImage(this.image, 0, 0);
          this.context.beginPath();

          this.context.moveTo(originX,originY);
          this.context.lineTo(x, y);
          this.context.stroke();

          this.context.closePath();
        } else if (this.type === 'rectangle') {
          this.context.clearRect(0,0,800,800);
          this.context.drawImage(this.image, 0, 0);
          this.context.beginPath();

          if (x < originX) {
            newOriginX = x;
          }
          if (y < originY) {
            newOriginY = y;
          }
          this.context.rect(newOriginX, newOriginY, Math.abs(x-originX), Math.abs(y-originY));
          this.context.stroke();

          this.context.closePath();
        } else if (this.type === 'circle') {
          this.context.clearRect(0,0,800,800);
          this.context.drawImage(this.image, 0, 0);
          this.context.beginPath();

          if (x < originX) {
            newOriginX = x;
          }
          if (y < originY) {
            originY = y;
          }
          let r = Math.sqrt(Math.abs(x-originX) * Math.abs(x-originX) + Math.abs(y-originY) * Math.abs(y-originY));
          this.context.arc(Math.abs(x-originX)+newOriginX, Math.abs(y-originY)+newOriginY , r, 0, 2*Math.PI);
          this.context.fillStyle = this.color.value;
          this.context.fill();

          this.context.closePath();
        }
      }
    }, false);
  }
  endOfDrawing () {
    if (this.isDrawing) {
      this.context.closePath();
      this.isDrawing = false;
    }
  }
  handleOperations () {
    return {
      pencil: () => { this.type = 'pencil'; },
      straightLine: () => { this.type = 'straightLine'; },
      rectangle: () => { this.type = 'rectangle'; },
      eraser: () => { this.type = 'eraser'; },
      circle: () => { this.type = 'circle'; },
      image: () => { 
        this.imageFile.click();
        this.imageFile.onchange = (event) => {
          let reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (evt) => {
            let img = new Image();
            img.src = evt.target.result;
            this.context.drawImage(img, 0, 0); // 将图片直接画在画布上
          }
        }
      },
      save: () => {
        this.downloadLink.href = this.canvas.toDataURL('image/png');
        this.downloadLink.download = 'drawing.jpeg';
        this.downloadLink.click();
      }
    }
  }
}

window.onload = () => {
  const draw = new Draw(elements);
  draw.init();
};