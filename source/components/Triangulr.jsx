import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Triangulr extends Component {
  componentDidMount() {
    window.addEventListener('load', this.handleLoad.bind(this));
  }

  componentDidUpdate() {
    this.handleLoad();
  }

  Path = ({ data, color }) => {
    const { pathCallback } = this.props;

    let pathColor = typeof color === 'function' ? color() : color;

    const callbackResult = pathCallback(data);
    if (callbackResult !== undefined) {
      pathColor = callbackResult;
    }

    const points = `M${data.points[0].x} ${data.points[0].y} L${data.points[1].x} ${data.points[1].y} L${data.points[2].x} ${data.points[2].y} Z`;

    const style = {
      fill: pathColor,
      stroke: pathColor,
      strokeWidth: 1,
    };

    const className = data.class || [];

    return (
      <path
        d={points}
        style={style}
        data-row={data.coordinates.y}
        data-col={data.coordinates.x}
        data-right={data.right}
        className={className.join(' ')}
      />
    );
  };

  lineMapping() {
    let parity = this.triangleWidth / 4;
    let x;
    let y;
    let line;

    for (y = 0; y <= this.width; y += 1) {
      line = [];
      for (x = 0; x <= this.height; x += 1) {
        line.push({
          x: y * this.triangleHeight,
          y: x * this.triangleWidth + this.originX + parity,
        });
      }
      this.lines.push(line);
      parity *= -1;
    }
  }

  createTriangles() {
    let x;
    let parity;
    let lineA;
    let lineB;
    let aIndex;
    let bIndex;
    let points;
    let pointsList;
    let lineParite = true;
    this.exportData = [];

    for (x = 0; x < this.lines.length - 1; x += 1) {
      lineA = this.lines[x];
      lineB = this.lines[x + 1];
      aIndex = 0;
      bIndex = 0;
      parity = lineParite;

      do {
        // Get the good points
        points = [lineA[aIndex], lineB[bIndex]];
        if (parity) {
          bIndex += 1;
          points.push(lineB[bIndex]);
        } else {
          aIndex += 1;
          points.push(lineA[aIndex]);
        }
        parity = !parity;

        pointsList = [points[0], points[1], points[2]];
        const rowId = aIndex + bIndex - 1;

        // Save the triangle
        this.exportData.push({
          id: `r${rowId}c${x}`,
          points: pointsList,
          coordinates: { x, y: rowId },
        });
      } while (aIndex !== lineA.length - 1 && bIndex !== lineA.length - 1);

      lineParite = !lineParite;
    }
  }

  handleLoad() {
    const { complete } = this.props;
    complete();
  }

  render() {
    const {
      triangleWidth, width, height, color, callback,
    } = this.props;

    this.triangleWidth = triangleWidth;
    this.width = width;
    this.height = height;

    const triangleWidthPow = triangleWidth ** 2; // Math.pow(triangleWidth, 2)
    const triangleWidthHalfPow = (triangleWidth / 2) ** 2; // Math.pow(triangleWidth / 2, 2)
    this.triangleHeight = Math.sqrt(triangleWidthPow - triangleWidthHalfPow);
    this.triangleHeight = Math.round(this.triangleHeight);

    this.width = Math.floor(this.width / this.triangleHeight);
    this.height = Math.ceil(this.height / this.triangleWidth) + 1;

    // if not even, add one column
    if (this.width % 2 === 1) {
      this.width += 1;
    }

    this.originX = -this.triangleWidth / 4;

    this.lines = [];
    this.exportData = [];

    this.lineMapping();
    this.createTriangles();

    let data = this;

    const callbackResults = callback(data);
    if (callbackResults !== undefined) {
      data = callbackResults;
    }

    const { Path } = this;

    return (
      <svg
        viewBox={`0 0 ${this.width * this.triangleHeight} ${this.height * this.triangleWidth}`}
        preserveAspectRatio="xMinYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {data.exportData.map(triangle => (
          <Path key={triangle.id} data={triangle} color={triangle.color || color} />
        ))}
      </svg>
    );
  }
}

Triangulr.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  triangleWidth: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.func.isRequired]),
  pathCallback: PropTypes.func,
  callback: PropTypes.func,
  complete: PropTypes.func,
};

Triangulr.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight,
  color: '#4286f4',
  triangleWidth: 40,
  pathCallback: () => { },
  callback: () => { },
  complete: () => { },
};
