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
                <input type="range" min="0" max="100" defaultValue="50" />
                <span>🔊</span>
            </div>
        </>

    );
}

export default VolumeControls;