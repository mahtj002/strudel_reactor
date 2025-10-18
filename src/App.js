import './cors-redirect';
import './App.css';
import { initStrudel, note, hush, evalScope, getAudioContext, webaudioOutput, registerSynthSounds, initAudioOnFirstClick, transpiler } from "@strudel/web";
import { useEffect, useRef } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';

let globalEditor = null;



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

  useEffect(() => {

    if (!hasRun.current) {
      hasRun.current = true;
      (async () => {
        await initStrudel();

        globalEditor = new StrudelMirror({
          defaultOutput: webaudioOutput,
          getTime: () => getAudioContext().currentTime,
          transpiler,
          root: document.getElementById('editor'),
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
        Proc()
      })();
      document.getElementById('proc').value = stranger_tune
      SetupButtons()
    }

  }, []);

  return (
    <div>
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
            <div className="col-md-6">
              <div className="p-3 bg-light border border-dark rounded h-100 d-flex flex-column">

                <div className="row">
                  <nav>
                    <button id="process" className="btn btn-outline-primary">Preprocess</button>
                    <button id="process_play" className="btn btn-outline-primary">Proc & Play</button>
                    <button id="play" className="btn btn-outline-primary">Play</button>
                    <button id="stop" className="btn btn-outline-primary">Stop</button>
                  </nav>
                </div>

                <div className="row">
                  <nav>
                    <button id="process" className="btn btn-outline-secondary">Save</button>
                    <button id="process_play" className="btn btn-outline-secondary">Load</button>
                  </nav>
                </div>

                {/* Keypad for specific items */}

                <div className="container text-center">
                  <div className="row row-cols-4">
                    <div className="col">
                      <button className="pad-btn" style={{ backgroundColor: "#FFCC80" }}></button>
                    </div>
                    <div className="col">
                      <button className="pad-btn" style={{ backgroundColor: "#FFCC80" }}></button>
                    </div>
                    <div className="col">
                      <button className="pad-btn" style={{ backgroundColor: "#FFCC80" }}></button>
                    </div>

                    <div className="col-1 d-flex justify-content-center align-items-center">
                      <label><input type="checkbox"></input></label>
                    </div>

                    <div className="col">
                      <button className="pad-btn" style={{ backgroundColor: "#FFCC80" }}></button>
                    </div>
                    <div className="col">
                      <button className="pad-btn" style={{ backgroundColor: "#FFCC80" }}></button>
                    </div>
                    <div className="col">
                      <button className="pad-btn" style={{ backgroundColor: "#FFCC80" }}></button>
                    </div>

                    <div className="col-1 d-flex justify-content-center align-items-center">
                      <label><input type="checkbox"></input></label>
                    </div>

                    <div className="col">
                      <button className="pad-btn" style={{ backgroundColor: "#FFCC80" }}></button>
                    </div>
                    <div className="col">
                      <button className="pad-btn" style={{ backgroundColor: "#FFCC80" }}></button>
                    </div>
                    <div className="col">
                      <button className="pad-btn" style={{ backgroundColor: "#FFCC80" }}></button>
                    </div>

                    <div className="col-1 d-flex justify-content-center align-items-center">
                      <label><input type="checkbox"></input></label>
                    </div>


                    <div className="col d-flex justify-content-center align-items-center">
                      <button className="mute-btn" style={{ backgroundColor: "#FFCC80" }}>🔇</button>
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

