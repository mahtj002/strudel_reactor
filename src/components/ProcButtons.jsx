function ProcButtons({onPlay, onStop, onProcAndPlay, onProcess}){
    return(
        <>
            <div className="row mt-2">
                <nav className="d-flex flex-wrap gap-2">
                    <button id="process" className="btn btn-primary" onClick={onProcess}>Preprocess</button>
                    <button id="process_play" className="btn btn-primary" onClick={onProcAndPlay}>Proc & Play</button>
                    <button id="play" className="btn btn-success" onClick={onPlay}>Play</button>
                    <button id="stop" className="btn btn-danger" onClick={onStop}>Stop</button>
                </nav>
            </div>
        </>
    );
}

export default ProcButtons;