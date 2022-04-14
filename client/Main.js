import React from "react";
import * as Tone from "tone";
import Paper from "paper";
import Sketch from "./Sketch";
import { Color, Gradient } from "paper/dist/paper-core";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: new Color(0.5, 0.5, 0.5),
      synths: {},
      segment: 0,
      keys: {
        a: { note: "C4", color: "white", status: "", segment: 0 },
        w: { note: "C#4", color: "black", status: "", segment: 1 },
        s: { note: "D4", color: "white", status: "", segment: 2 },
        e: { note: "D#4", color: "black", status: "", segment: 3 },
        d: { note: "E4", color: "white", status: "", segment: 4 },
        f: { note: "F4", color: "white", status: "", segment: 5 },
        t: { note: "F#4", color: "black", status: "", segment: 6 },
        g: { note: "G4", color: "white", status: "", segment: 7 },
        y: { note: "G#4", color: "black", status: "", segment: 8 },
        h: { note: "A4", color: "white", status: "", segment: 9 },
        u: { note: "A#4", color: "black", status: "", segment: 10 },
        j: { note: "B4", color: "white", status: "", segment: 11 },
        k: { note: "C5", color: "white", status: "", segment: 12 },
        o: { note: "C#5", color: "black", status: "", segment: 13 },
        l: { note: "D5", color: "white", status: "", segment: 14 },
        p: { note: "D#5", color: "black", status: "", segment: 15 },
        ";": { note: "E5", color: "white", status: "", segment: 16 },
        "'": { note: "F5", color: "white", status: "", segment: 17 },
        "]": { note: "F#5", color: "black", status: "", segment: 18 },
        Enter: { note: "G5", color: "white", status: "", segment: 19 },
      },
    };
    this.clickHandler = this.clickHandler.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
  }

  async componentDidMount() {
    await Tone.start();
    console.log("audio is ready");
  }

  clickHandler(evt) {
    const note = evt.target.name;
    // click
    if (evt.type === "mousedown") {
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttack(note);
      this.setState({
        synths: { ...this.state.synths, [note]: synth },
      });
    }
    // release
    if (evt.type === "mouseup" || evt.type === "mouseleave") {
      if (this.state.synths[note]) {
        this.state.synths[note].triggerRelease();
      }
    }
  }

  async keyHandler(evt) {
    // return if key doesn't correspond to a note
    const key = evt.key;

    if (!(key in this.state.keys)) {
      return;
    }

    const note = this.state.keys[evt.key].note;
    // play note on press
    if (evt.type === "keydown") {
      // prevent repeated trigger when holding down key
      if (evt.repeat) {
        return;
      }
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttack(note);

      const newColor = this.state.color;
      const colorTrans = Math.random() / 2 - 0.25;

      const whichColor = Math.floor(Math.random() * 3);
      newColor.red += whichColor === 0 ? colorTrans : 0;
      newColor.green += whichColor === 1 ? colorTrans : 0;
      newColor.blue += whichColor === 2 ? colorTrans : 0;

      this.setState({
        synths: { ...this.state.synths, [note]: synth },
        keys: {
          ...this.state.keys,
          [key]: { ...this.state.keys[key], status: "active" },
        },
        color: new Color(newColor.red, newColor.green, newColor.blue),
        // color: new Color(Math.random(), Math.random(), Math.random()),
        segment: this.state.keys[key].segment,
      });
    }
    // release
    if (evt.type === "keyup") {
      this.state.synths[note].triggerRelease();
      this.setState({
        keys: {
          ...this.state.keys,
          [key]: { ...this.state.keys[evt.key], status: "" },
        },
      });
    }
  }

  render() {
    const keys = this.state.keys;
    const notes = Object.keys(keys);
    return (
      <div id="main">
        <Sketch color={this.state.color} segment={this.state.segment} />
        <div id="title">
          <h1>stalactite</h1>
        </div>
        <div
          className="instrument"
          onKeyDown={this.keyHandler}
          onKeyUp={this.keyHandler}
        >
          {notes.map((note) => (
            <button
              className={`key ${keys[note].color} ${keys[note].status}`}
              key={keys[note].note}
              name={keys[note].note}
              onMouseDown={this.clickHandler}
              onMouseUp={this.clickHandler}
              onMouseEnter={this.clickHandler}
              onMouseLeave={this.clickHandler}
            >
              {keys[note].note}
            </button>
          ))}
        </div>
      </div>
    );
  }
}
