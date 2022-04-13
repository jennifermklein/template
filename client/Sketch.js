import React from "react";
import paper from "paper";
import { Point } from "paper/dist/paper-core";

export default class Sketch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shape: "",
    };
  }
  componentDidMount() {
    const color = this.props.color || "fuschia";
    console.log(color);
    const canvas = document.getElementById("canvas");
    console.log(canvas);
    paper.setup(canvas);

    // const width = paper.view.size.width;
    // const height = paper.view.size.height;
    // const circle = new paper.Shape.Circle({
    //   center: [width / 2, height / 2],
    //   fillColor: color,
    //   radius: width / 5,
    // });
    // paper.view.draw();
    // this.setState({
    //   shape: circle,
    // });

    const width = paper.view.size.width;
    const height = paper.view.size.height;
    const amt = 10;
    const step = width / amt;

    const line = new paper.Path({
      strokeColor: color,
      strokeWidth: height / 10,
      position: paper.view.center,
    });

    for (let i = 0; i <= amt; i++) {
      line.add(new Point(i * step, 0));
    }
    paper.view.draw();
    this.setState({
      shape: line,
    });
  }

  componentDidUpdate() {
    const newShape = this.state.shape;
    newShape.fillColor = this.props.color;
    newShape.strokeColor = this.props.color;

    const width = paper.view.size.width;
    const height = paper.view.size.height;
    const amt = 10;
    const step = width / amt;

    for (let i = 1; i < amt; i++) {
      newShape.segments[i].point = [i * step, Math.random() * height * 0.8];
    }
    newShape.smooth();
  }

  render() {
    return <canvas id="canvas" resize="true" />;
  }
}
