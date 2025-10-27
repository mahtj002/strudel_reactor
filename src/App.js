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
import DJControls  from './components/DJControls';
import RadioButtons from './components/RadioButtons';
import VolumeControls from './components/VolumeControls';
import BPMControl from './components/BPMControl';
import SaveAndLoadButtons from './components/SaveAndLoadButtons';
import ProcButtons from './components/ProcButtons';

let globalEditor = null;
let globalPadsOff = Array(9).fill(false);

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
  let proc_text_replaced = proc_text
    .replaceAll('<bassline>', () => ProcessText(0))
    .replaceAll('<main_arp>', () => ProcessText(1))
    .replaceAll('<drums>', () => ProcessText(2))
    .replaceAll('<drum_set_2>', () => ProcessText(3));
    
    globalEditor.setCode(proc_text_replaced) 
} 
  
export function ProcessText(index) { 
  let replace = "" 

  if (globalPadsOff[index]) {
    replace = "_";
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

  useEffect(() => {
    globalPadsOff = padsOff;
  }, [padsOff]);

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

                <ProcButtons/>

                <SaveAndLoadButtons/>

                {/* Keypad for specific items */}

                <div className="container text-center mt-2">
                  <div className="row row-cols-4 justify-content-center">
                   
                    <RadioButtons padsOff={padsOff}
                      togglePad={togglePad}
                      toggle1={toggle1}
                      setToggle1={setToggle1}
                      toggle2={toggle2}
                      setToggle2={setToggle2}
                      toggle3={toggle3}
                      setToggle3={setToggle3}
                      ProcAndPlay={ProcAndPlay}
                      />

                    <VolumeControls 
                      isMuted={isMuted} 
                      handleMuteClick={handleMuteClick} 
                      />

                    <BPMControl/>

                  </div>
                </div>

                {/* <DJControls /> */}

                </div>
              </div>
            </div>
        </div>
        <canvas id="roll"></canvas>
      </main >
    </div >
);


}