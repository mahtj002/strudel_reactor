function BPMControl(props){
    return(
        <>
            <div className="col d-flex justify-content-center align-items-center">
                <input 
                type="number" 
                placeholder="BPM" 
                value={props.bpm} 
                style={{ width: '60px', textAlign: 'center' }}
                step={0.1}
                min={0.1}
                max={0.8}
                onChange={(e) => {
                        const newBPM = e.target.value;
                        props.setBPM(newBPM);
                        props.bpmChange(newBPM);
                    }}></input>
            </div>
        </>
    );
}

export default BPMControl;