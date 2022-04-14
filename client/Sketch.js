import React from "react";
import paper from "paper";

export default class Sketch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shape: "",
      color: "",
    };
  }
  componentDidMount() {
    const color = this.props.color || "fuschia";
    const canvas = document.getElementById("canvas");
    paper.setup(canvas);

    const width = paper.view.size.width;
    const height = paper.view.size.height;
    const amt = 20;
    const step = width / (amt - 1);

    const line = new paper.Path({
      strokeColor: color,
      strokeWidth: 18,
      strokeCap: "round",
    });

    for (let i = 0; i < amt; i++) {
      line.add(new paper.Point(i * step, Math.random() * height * 0.6));
    }

    line.smooth();
    this.setState({
      color: color,
      shape: line,
    });
  }

  componentDidUpdate() {
    if (this.state.color != this.props.color) {
      const newShape = this.state.shape;
      const color = this.props.color;
      newShape.strokeColor = color;
      newShape.fillColor = "white";

      const width = paper.view.size.width;
      const height = paper.view.size.height;
      const amt = 20;
      const step = width / (amt - 1);

      const i = this.props.segment;
      const y = newShape.segments[i].point._y;
      const transform = Math.random() * 80 - 40;
      const newY = Math.max(height * 0.3, Math.min(height * 7, y + transform));
      if (newShape && newShape.segments[i]) {
        newShape.segments[i].point = [i * step, newY];
        const circle = new paper.Path.Circle(
          new paper.Point(
            newShape.segments[i].point._x + transform / 2,
            newShape.segments[i].point._y
          ),
          9
        );
        circle.fillColor = color;
        (circle.shadowColor = new paper.Color(0, 0, 0)),
          // Set the shadow blur radius to 12:
          (circle.shadowBlur = 3),
          // Offset the shadow by { x: 5, y: 5 }
          (circle.shadowOffset = new paper.Point(1, 1));
      }

      newShape.smooth();
      this.setState({
        color: color,
        shape: newShape,
      });
    }
  }

  render() {
    return <canvas id="canvas" resize="true" />;
  }
}
