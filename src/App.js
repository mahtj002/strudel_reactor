import './App.css';
import { useEffect, useRef } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import { useState } from 'react';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

export function SetupButtons() {

    document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
    document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
    document.getElementById('process').addEventListener('click', () => {
        Proc()
    }
    )
    document.getElementById('process_play').addEventListener('click', () => {
        if (globalEditor != null) {
            Proc()
            globalEditor.evaluate()
        }
    }
    )
}



export function ProcAndPlay() {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        console.log(globalEditor)
        Proc()
        globalEditor.evaluate();
    }
}

export function Proc() {

    let proc_text = document.getElementById('proc').value
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    ProcessText(proc_text);
    globalEditor.setCode(proc_text_replaced)
}

export function ProcessText(match, ...args) {

    let replace = ""
    if (document.getElementById('flexRadioDefault2').checked) {
        replace = "_"
    }

    return replace
}

export default function StrudelDemo() {

  const hasRun = useRef(false);
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);

  const [padsOff, setPadsOff] = useState(Array(9).fill(false));

  const togglePad = (index) => {
  setPadsOff(prev => {
    const newState = [...prev];
    newState[index] = !newState[index];
    return newState;
  });
};

  const [isMuted, setIsMuted] = useState(false);

  const handleMuteClick = () => {
    setIsMuted(!isMuted);
  };
const hasRun = useRef(false);

useEffect(() => {

    if (!hasRun.current) {
        document.addEventListener("d3Data", handleD3Data);
        console_monkey_patch();
        hasRun.current = true;
        //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps
            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });
            
        document.getElementById('proc').value = stranger_tune
        SetupButtons()
        Proc()
    }

}, []);

  return (
    <div style={{ backgroundColor: '#c4c4c4ff', minHeight: '100vh' }}>
      <h2>Strudel Demo</h2>
      <main>

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="row-md-6" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Text to preprocess:</label>
                <textarea className="form-control" rows="15" id="proc" ></textarea>
              </div>

              {/* Editor */}
              <div className="row">
                <div className="row-md-6" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                  <div id="editor" />
                </div>
              </div>
            </div>


            {/* Buttons */}
            <div className="col-md-6 d-flex justify-content-center align-items-center" >
              <div className="p-3 bg-light border border-dark rounded d-flex flex-column align-items-center" 
              style={{ width: '80%', minHeight: '70vh'}}>

                <div className="row mt-2">
                  <nav className="d-flex flex-wrap gap-2">
                    <button id="process" className="btn btn-primary">Preprocess</button>
                    <button id="process_play" className="btn btn-primary">Proc & Play</button>
                    <button id="play" className="btn btn-success">Play</button>
                    <button id="stop" className="btn btn-danger">Stop</button>
                  </nav>
                </div>

                <div className="row mt-2">
                  <nav className="d-flex flex-wrap gap-2">
                    <button id="process" className="btn btn-secondary">Save</button>
                    <button id="process_play" className="btn btn-secondary">Load</button>
                  </nav>
                </div>

                {/* Keypad for specific items */}

                <div className="container text-center mt-2">
                  <div className="row row-cols-4 justify-content-center">
                    <div className="col">
                      <button className={`pad-btn ${padsOff[0] ? 'off' : ''}`} 
                      onClick={() => togglePad(0)}
                      style={{ backgroundColor: "#FFCC80" }}></button>
                    </div>
                    <div className="col">
                      <button className={`pad-btn ${padsOff[1] ? 'off' : ''}`} 
                      onClick={() => togglePad(1)} 
                      style={{ backgroundColor: "#FFA08F" }}></button>
                    </div>
                    <div className="col">
                      <button className={`pad-btn ${padsOff[2] ? 'off' : ''}`} 
                      onClick={() => togglePad(2)} 
                      style={{ backgroundColor: "#8FC9FF" }}></button>
                    </div>

                    <div className="col-2 d-flex justify-content-center align-items-center">
                      <button className={`toggle-btn ${toggle1 ? "toggled" : ""}`} 
                        style={{ backgroundColor: toggle1 ? '#5e43d6d7' : '#e0e0e0' }}
                        onClick={() => setToggle1(!toggle1)}>
                          <div className="thumb"></div>
                      </button>
                    </div>

                    <div className="col mt-2">
                      <button className={`pad-btn ${padsOff[3] ? 'off' : ''}`} 
                      onClick={() => togglePad(3)} 
                      style={{ backgroundColor: "#FBFF8F" }}></button>
                    </div>
                    <div className="col mt-2">
                      <button className={`pad-btn ${padsOff[4] ? 'off' : ''}`} 
                      onClick={() => togglePad(4)}
                      style={{ backgroundColor: "#FF8FDA" }}></button>
                    </div>
                    <div className="col mt-2">
                      <button className={`pad-btn ${padsOff[5] ? 'off' : ''}`} 
                      onClick={() => togglePad(5)} 
                      style={{ backgroundColor: "#E18FFF" }}></button>
                    </div>

                    <div className="col-2 d-flex justify-content-center align-items-center">
                      <button className={`toggle-btn ${toggle2 ? "toggled" : ""}`}
                        style={{ backgroundColor: toggle2 ? '#f32525ff' : '#e0e0e0' }}
                        onClick={() => setToggle2(!toggle2)}>
                          <div className="thumb"></div>
                      </button>
                    </div>

                    <div className="col mt-2">
                      <button className={`pad-btn ${padsOff[6] ? 'off' : ''}`} 
                      onClick={() => togglePad(6)} 
                      style={{ backgroundColor: "#68FBA8" }}></button>
                    </div>
                    <div className="col mt-2">
                      <button className={`pad-btn ${padsOff[7] ? 'off' : ''}`} 
                      onClick={() => togglePad(7)} 
                      style={{ backgroundColor: "#8FD6FF" }}></button>
                    </div>
                    <div className="col mt-2">
                      <button className={`pad-btn ${padsOff[8] ? 'off' : ''}`} 
                      onClick={() => togglePad(8)} 
                      style={{ backgroundColor: "#A8FF8F" }}></button>
                    </div>

                    <div className="col-2 d-flex justify-content-center align-items-center">
                      <button className={`toggle-btn ${toggle3 ? "toggled" : ""}`}
                        style={{ backgroundColor: toggle3 ? 'gold' : '#e0e0e0' }}
                        onClick={() => setToggle3(!toggle3)}>
                          <div className="thumb"></div>
                      </button>
                    </div>

                    <div className="col d-flex justify-content-center align-items-center mt-2">
                      <button className="mute-btn" 
                      style={{ backgroundColor: "#c8c5c0ff" }}
                      onClick={handleMuteClick}>{isMuted ? "🔇" : "🔊" }</button>
                    </div>

                    <div className="col d-flex justify-content-center align-items-center">
                      <span>🔈</span>
                      <input type="range" min="0" max="100" defaultValue="50" />
                      <span>🔊</span>
                    </div>

                    <div className="col d-flex justify-content-center align-items-center">
                      <input type="number" placeholder="BPM" style={{ width: '60px', textAlign: 'center' }}></input>
                    </div>
                  </div>
                </div>

                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={ProcAndPlay} defaultChecked />
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                      p1: ON
                    </label>
                  </div>

                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={ProcAndPlay} />
                      <label className="form-check-label" htmlFor="flexRadioDefault2">
                        p1: HUSH
                      </label>
                    </div> 

                </div>
              </div>
            </div>
        </div>
      </main >
    </div >
);


}