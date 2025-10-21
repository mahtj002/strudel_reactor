function ProcButtons(){
    return(
        <>
            <div className="row mt-2">
                <nav className="d-flex flex-wrap gap-2">
                    <button id="process" className="btn btn-primary">Preprocess</button>
                    <button id="process_play" className="btn btn-primary">Proc & Play</button>
                    <button id="play" className="btn btn-success">Play</button>
                    <button id="stop" className="btn btn-danger">Stop</button>
                </nav>
            </div>
        </>
    );
}

export default ProcButtons;