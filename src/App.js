import './App.css';
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import RadioButtons from './components/RadioButtons';
import VolumeControls from './components/VolumeControls';
import BPMControl from './components/BPMControl';
import SaveAndLoadButtons from './components/SaveAndLoadButtons';
import ProcButtons from './components/ProcButtons';
import PreprocessTextArea from './components/PreprocessTextArea';

let globalEditor = null;
let globalPadsOff = Array(9).fill(false); // Tracks which pads are on/off

const handleD3Data = (event) => {
    console.log(event.detail);
};

// Prefixes instrument with an underscore to mute it 
export function ProcessText(index) {
  const instruments = ['bassline', 'main_arp', 'drums', 'drum_set_2'];
  const name = instruments[index];
  
  if (globalPadsOff[index]) {
    return `_${name}`;
  } else {
    return name;
  }
}

export default function StrudelDemo() {

  const hasRun = useRef(false);
  const [songText, setSongText] = useState(stranger_tune)

  // Slider buttons
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);

  const [padsOff, setPadsOff] = useState(Array(9).fill(false));
  const [volume, setVolume] = useState(1);
  const [bpm, setBPM] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Runs the strudel code to play music
  const handlePlay = () => {
    globalEditor.evaluate()
  }

  // Stops all Strudel sounds
  const handleStop = () => {
    globalEditor.stop()
  }

  // Updates the editor content before running
  const handleProcess = () => {
    let proc_text = songText;

    // Replaces instruments with underscore prefix based on mute state
    let proc_text_replaced = proc_text
      .replaceAll('bassline', () => ProcessText(0))
      .replaceAll('main_arp', () => ProcessText(1))
      .replaceAll('drums', () => ProcessText(2))
      .replaceAll('drum_set_2', () => ProcessText(3));

    globalEditor.setCode(proc_text_replaced) 
  }

  // Adjusts '.gain' in the Strudel to allow user to change the volume
  const handleVolumeChange = (newVolume) => {
    let proc_text = songText;

    let proc_text_replaced = proc_text
      .replaceAll('.gain(1)', `.gain(${newVolume})`) // Gain adjusts the volume

    globalEditor.setCode(proc_text_replaced)
  }

  // Adjusts 'cps' in Strudel which changes BPS
  const handleBPMChange = (newBPM) => {
    let proc_text = songText;
    let proc_text_replaced = proc_text
      .replaceAll('.cps(0.5)', `.cps(${newBPM})`) // CPS adjusts the bps

    globalEditor.setCode(proc_text_replaced)
  }

  const handleProcAndPlay = () => {
    console.log(globalEditor)
    handleProcess()
    globalEditor.evaluate();
  }

  // Toggles individual pad button state
  const togglePad = (index) => {
    setPadsOff(prev => {
    const newState = [...prev];
    newState[index] = !newState[index];
    return newState;
    });
  };

  // Mutes/Unmutes all buttons
  const handleMuteAll = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    setPadsOff(Array(padsOff.length).fill(newMuteState));
    handleProcess();
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
        // SetupButtons()
        // Proc()
    } 
    globalEditor.setCode(songText);
}, [songText]);

  return (
    <div style={{ backgroundColor: '#c4c4c4ff', minHeight: '100vh' }}>
      <h2>Strudel Demo</h2>
      <main>

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              
              <PreprocessTextArea defaultValue={songText} onChange={(e) => setSongText(e.target.value)}/>

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

                <ProcButtons onPlay={handlePlay} onStop={handleStop} onProcAndPlay={handleProcAndPlay} onProcess={handleProcess}/>
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
                      />

                    <VolumeControls 
                      isMuted={isMuted} 
                      muteAll={handleMuteAll}
                      volume={volume}
                      volumeChange={handleVolumeChange}
                      setVolume={setVolume}
                      />

                    <BPMControl
                    bpm={bpm}
                    setBPM={setBPM}
                    bpmChange={handleBPMChange}/>

                  </div>
                </div>
                </div>
              </div>
            </div>
        </div>
        <canvas id="roll"></canvas>
      </main >
    </div >
);

}