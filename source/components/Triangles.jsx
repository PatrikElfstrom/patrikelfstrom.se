import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import randomColorGenerator from '../utils/randomColorGenerator';
import randomNumber from '../utils/randomNumber';
import Triangulr from './Triangulr';
import styles from './Triangles.css';

export default class Triangles extends Component {
  // The design
  // Coordinates are relative to the center triangle
  logoDesign = [
    // Center
    { y: 0, x: 0 },
    { y: -1, x: 0 },
    { y: -1, x: -1 },
    { y: 0, x: -1 },
    { y: 1, x: -1 },
    { y: 1, x: 0 },

    // Ring Left
    { y: -5, x: -1 },
    { y: -4, x: -1 },
    { y: -4, x: -2 },
    { y: -3, x: -2 },
    { y: -3, x: -3 },
    { y: -2, x: -3 },
    { y: -1, x: -3 },
    { y: 0, x: -3 },
    { y: 1, x: -3 },
    { y: 2, x: -3 },
    { y: 3, x: -3 },

    // Ring right
    { y: -5, x: 0 },
    { y: -4, x: 0 },
    { y: -4, x: 1 },
    { y: -3, x: 1 },
    { y: -3, x: 2 },
    { y: -2, x: 2 },
    { y: -1, x: 2 },
    { y: 0, x: 2 },
    { y: 1, x: 2 },
    { y: 2, x: 2 },
    { y: 3, x: 2 },
    { y: 3, x: 1 },
    { y: 4, x: 1 },
    { y: 4, x: 0 },
    { y: 5, x: 0 },
    { y: 5, x: -1 },
    { y: 4, x: -1 },
  ];

  constructor(props) {
    super(props);

    this.container = React.createRef();

    this.state = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', debounce(this.updateDimensions.bind(this), 100));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  callback = (data) => {
    this.targetX = Math.floor(data.width / 2);
    this.targetY = Math.floor((data.height - 2) / 2); // -2 because of safety overflow

    // Find target and check if it's a right pointing triangle
    data.exportData.forEach((triangle) => {
      const isRight = triangle.points[0].y < triangle.points[1].y;
      const isTarget = this.targetY === triangle.coordinates.y
        && this.targetX === triangle.coordinates.x;

      if (isTarget && isRight) {
        this.targetY += 1;
      }
    });

    return data;
  };

  complete = () => {
    // Reset styles (since react doesnt rerender all elments)
    const logoTriangles = document.querySelectorAll('.logo');
    logoTriangles.forEach((polygon) => {
      const triangle = polygon;

      triangle.style.fill = triangle.dataset.color;
      triangle.style.stroke = triangle.dataset.color;
    });

    // Print design
    this.logoDesign.forEach((polygon) => {
      const triangle = document.querySelector(
        `[data-row="${this.targetY + polygon.y}"][data-col="${this.targetX + polygon.x}"]`,
      );

      triangle.dataset.color = triangle.style.fill;

      const color = randomColorGenerator(200, 100, 30, 0, 10);
      triangle.style.fill = color;
      triangle.style.stroke = color;

      triangle.style.transitionDelay = `${randomNumber(300, 1500)}ms`;

      triangle.classList.add('logo');
    });
  };

  updateDimensions() {
    this.setState({ innerWidth: window.innerWidth, innerHeight: window.innerHeight });
  }

  render() {
    const { innerWidth, innerHeight } = this.state;

    return (
      <div id="triangles" className={styles.triangles} ref={this.container}>
        <Triangulr
          callback={this.callback}
          width={innerWidth}
          height={innerHeight}
          color={randomColorGenerator}
          complete={this.complete}
        />
      </div>
    );
  }
}
