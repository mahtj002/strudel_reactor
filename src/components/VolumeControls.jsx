function VolumeControls(props){
    return(

        <>
            <div className="col d-flex justify-content-center align-items-center mt-2">
                <button className="mute-btn" 
                    style={{ backgroundColor: "#c8c5c0ff" }}
                    onClick={props.muteAll}>{props.isMuted ? "🔇" : "🔊" }
                </button>
            </div>

            <div className="col d-flex justify-content-center align-items-center">
                <span>🔈</span>
                <input type="range" min="0" max="1" step="0.01" defaultValue="1" value={props.volume}
                    onChange={(e) => {
                        const newVol = e.target.value;
                        props.setVolume(newVol);
                        props.volumeChange(newVol);
                    }}/>
                <span>🔊</span>
            </div>
        </>

    );
}

export default VolumeControls;