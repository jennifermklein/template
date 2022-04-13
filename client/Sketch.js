import React from "react";
import paper from "paper";

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

    const width = paper.view.size.width;
    const height = paper.view.size.height;
    const circle = new paper.Shape.Circle({
      center: [width / 2, height / 2],
      fillColor: color,
      radius: width / 5,
    });
    paper.view.draw();
    this.setState({
      shape: circle,
    });
  }

  componentDidUpdate() {
    const newShape = this.state.shape;
    newShape.fillColor = this.props.color;
  }

  render() {
    return <canvas id="canvas" />;
  }
}
