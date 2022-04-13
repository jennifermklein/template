import React from "react";
import * as Tone from "tone";
import Paper from "paper";
import Sketch from "./Sketch";
import { Color } from "paper/dist/paper-core";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: new Color(1, 0, 0.5),
      synths: {},
      keys: {
        a: { note: "C4", color: "white", status: "" },
        w: { note: "C#4", color: "black", status: "" },
        s: { note: "D4", color: "white", status: "" },
        e: { note: "D#4", color: "black", status: "" },
        d: { note: "E4", color: "white", status: "" },
        f: { note: "F4", color: "white", status: "" },
        t: { note: "F#4", color: "black", status: "" },
        g: { note: "G4", color: "white", status: "" },
        y: { note: "G#4", color: "black", status: "" },
        h: { note: "A4", color: "white", status: "" },
        u: { note: "A#4", color: "black", status: "" },
        j: { note: "B4", color: "white", status: "" },
        k: { note: "C5", color: "white", status: "" },
        o: { note: "C#5", color: "black", status: "" },
        l: { note: "D5", color: "white", status: "" },
        p: { note: "D#5", color: "black", status: "" },
        ";": { note: "E5", color: "white", status: "" },
        "'": { note: "F5", color: "white", status: "" },
        "]": { note: "F#5", color: "black", status: "" },
        Enter: { note: "G5", color: "white", status: "" },
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
      this.setState({
        synths: { ...this.state.synths, [note]: synth },
        keys: {
          ...this.state.keys,
          [evt.key]: { ...this.state.keys[evt.key], status: "active" },
        },
        color: new Color(Math.random(), Math.random(), Math.random()),
      });
    }
    // release
    if (evt.type === "keyup") {
      this.state.synths[note].triggerRelease();
      this.setState({
        keys: {
          ...this.state.keys,
          [evt.key]: { ...this.state.keys[evt.key], status: "" },
        },
      });
    }
    // console.log(this.state.color);
  }

  render() {
    const keys = this.state.keys;
    const notes = Object.keys(keys);
    return (
      <div id="main">
        <Sketch color={this.state.color} />
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
