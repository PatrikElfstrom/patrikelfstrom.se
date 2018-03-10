'use strict';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

Triangulr.prototype.BGR_COLOR = '#FFFFFF'
Triangulr.prototype.DEFAULT_FILL_COLOR = '#000000'
Triangulr.prototype.BLANK_COLOR = 'none'
Triangulr.prototype.AUTOSAVE_TIMER = 5000
Triangulr.prototype.TRIANGLE_WIDTH = 50

Triangulr.prototype.ACTION_FILL = 1
Triangulr.prototype.ACTION_ERASE = 2
Triangulr.prototype.ACTION_MOVE = 3
Triangulr.prototype.ACTION_SELECT = 4

function Triangulr(width, height, isLandscape, colorCallback = () => {}) {
  // Save input
  this.colorCallback = colorCallback;
  this.isLandscape = isLandscape
  this.mapWidth = parseInt(width, 10)
  this.mapHeight = parseInt(height, 10)

  this.triangleWidth = this.TRIANGLE_WIDTH
  this.triangleHeight = Math.sqrt(Math.pow(this.triangleWidth, 2) - Math.pow(this.triangleWidth / 2, 2))
  this.triangleHeight = Math.round(this.triangleHeight)

  this.mapWidth = Math.ceil(this.mapWidth/this.triangleHeight) + 4;
  this.mapHeight = Math.ceil(this.mapHeight/this.triangleWidth) + 10;

  this.blockWidth = (this.triangleWidth / 2)
  this.blockRatio = this.blockWidth / this.triangleHeight
  this.lineLength = (this.isLandscape ? this.mapWidth : this.mapHeight) * 2 - 1
  this.originX = - this.triangleHeight;

  this.lines = []
  this.exportData = []
  this.palette = []
  this.selection = null
  // this.backStack = new BackStack()

  this.lineMapping()
  this.createTriangles()
  return this.generateDom()

  window.debugPlayground = this //# DEV : kill this
}

Triangulr.prototype.lineMapping = function () {

  let x, y, line,
      parity = this.triangleWidth / 4,
      gap = parity

  if (this.isLandscape) {
    for (y = 0; y<=this.mapHeight; y++) {
      line = []
      for (x = 0; x<=this.mapWidth; x++) {
        line.push({
          x: x * this.triangleWidth + this.originX + parity,
          y: y * this.triangleHeight
        })
      }
      this.lines.push(line)
      parity *= -1
    }
  }
  else {
    for (y = 0; y<=this.mapWidth; y++) {
      line = []
      for (x = 0; x<=this.mapHeight; x++) {
        line.push({
          x: y * this.triangleHeight,
          y: x * this.triangleWidth + this.originX + parity
        })
      }
      this.lines.push(line)
      parity *= -1
    }
  }
}

Triangulr.prototype.createTriangles = function () {

  let x, parity, lineA, lineB, aIndex, bIndex, points, poly, pointsList,
      counter = 0,
      lineParite = true
  this.exportData = []

  for (x = 0; x<this.lines.length -1; x++) {
    lineA = this.lines[x]
    lineB = this.lines[x+1]
    aIndex = 0
    bIndex = 0
    parity = lineParite

    do {
      // Get the good points
      points = [lineA[aIndex], lineB[bIndex]]
      if (parity) {
        bIndex++
        points.push(lineB[bIndex])
      }
      else {
        aIndex++
        points.push(lineA[aIndex])
      }
      parity = !parity

      // Save the triangle
      pointsList = [
        points[0],
        points[1],
        points[2]
      ]
      this.exportData.push({
        points: pointsList,
        row: aIndex + bIndex - 1,
        col: x,
        right: pointsList[0].y < pointsList[1].y
      })
      counter++
    } while (aIndex != lineA.length-1 && bIndex != lineA.length-1)

    lineParite = !lineParite
  }
}


Triangulr.prototype.generateDom = function () {
  // if (this.svgTag) {
  //   this.container.removeChild(this.svgTag)
  //   this.svgTag.remove()
  // }

  let svgTag = this.generateSVG(),
      pos = null

  // Set the SVG
  // this.svgTag = svgTag
  // this.container.appendChild(svgTag)
  return svgTag
}


Triangulr.prototype.generateSVG = function (isClean) {
  let i, data, points, polygon,
      svgTag = document.createElementNS(SVG_NAMESPACE, 'svg')

  svgTag.setAttribute('version', '1.1')
  svgTag.setAttribute('preserveAspectRatio', 'xMinYMin slice')
  svgTag.setAttribute('xmlns', SVG_NAMESPACE)
  if (this.isLandscape) {
    svgTag.setAttribute('width', this.mapWidth * this.triangleWidth)
    svgTag.setAttribute('height', this.mapHeight * this.triangleHeight)
    svgTag.setAttribute('viewBox', '0 0 ' + (this.mapWidth * this.triangleWidth) + ' ' + (this.mapHeight * this.triangleHeight))
  }
  else {
    svgTag.setAttribute('width', this.mapWidth * this.triangleHeight)
    svgTag.setAttribute('height', this.mapHeight * this.triangleWidth)
    svgTag.setAttribute('viewBox', '0 0 ' + (this.mapWidth * this.triangleHeight) + ' ' + (this.mapHeight * this.triangleWidth))
  }

  // Metadata
  if (isClean) {
    svgTag.appendChild(document.createComment(JSON.stringify({
      isLandscape: this.isLandscape,
      mapWidth: this.mapWidth,
      mapHeight: this.mapHeight,
      palette: this.palette
    })))
  }

  for (i in this.exportData) {
    data = this.exportData[i]
    if (isClean && !data.color) {
      continue
    }
    polygon = document.createElementNS(SVG_NAMESPACE,'path')
    points   = 'M' + data.points[0].x + ' ' + data.points[0].y + ' '
    points  += 'L' + data.points[1].x + ' ' + data.points[1].y + ' '
    points  += 'L' + data.points[2].x + ' ' + data.points[2].y + ' Z'
    polygon.setAttribute('d', points)
    if (!isClean || data.color !== this.DEFAULT_FILL_COLOR) {
      const color = this.colorCallback();
        polygon.style.fill = color;
        polygon.style.stroke = color;
      polygon.setAttribute('stroke-width', '1')
    }
    polygon.setAttribute('rel', i)

    polygon.dataset.row = data.row;
    polygon.dataset.col = data.col;
    polygon.dataset.right = data.right;

    svgTag.appendChild(polygon)

    svgTag.dataset.cols = this.lines.length;
    svgTag.dataset.rows = (this.lines[0].length - 2) * 2;
  }
  return svgTag
}

// Exports
if (typeof define === 'function' && define.amd) {
  // AMD. Register as an anonymous module.
  define([], function() {
    return Triangulr;
  });
} else if (typeof exports === 'object') {
  // Node. Does not work with strict CommonJS, but
  // only CommonJS-like environments that support module.exports,
  // like Node.
  module.exports = Triangulr;
} else {
  // Browser globals
  window.Triangulr = Triangulr;
}
