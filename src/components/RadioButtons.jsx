function RadioButtons(props) {
    return(
        <>
            <div className="col">
                <button className={`pad-btn ${props.padsOff[0] ? 'off' : ''}`} 
                    onClick={() => 
                        props.togglePad(0)}
                    style={{ backgroundColor: "#FFCC80" }}></button>
            </div>

            <div className="col">
                <button className={`pad-btn ${props.padsOff[1] ? 'off' : ''}`} 
                    onClick={() => props.togglePad(1)} 
                    style={{ backgroundColor: "#FFA08F" }}></button>
            </div>
            
            <div className="col">
                <button className={`pad-btn ${props.padsOff[2] ? 'off' : ''}`} 
                    onClick={() => props.togglePad(2)} 
                    style={{ backgroundColor: "#8FC9FF" }}></button>
            </div>

            <div className="col-2 d-flex justify-content-center align-items-center">
                    <button className={`toggle-btn ${props.toggle1 ? "toggled" : ""}`} 
                        style={{ backgroundColor: props.toggle1 ? '#5e43d6d7' : '#e0e0e0' }}
                        onClick={() => props.setToggle1(!props.toggle1)}>
                        <div className="thumb"></div>
                    </button>
            </div>

            <div className="col mt-2">
                <button className={`pad-btn ${props.padsOff[3] ? 'off' : ''}`} 
                    onClick={() => props.togglePad(3)} 
                    style={{ backgroundColor: "#FBFF8F" }}></button>
            </div>
            
            <div className="col mt-2">
                <button className={`pad-btn ${props.padsOff[4] ? 'off' : ''}`} 
                onClick={() => props.togglePad(4)}
                style={{ backgroundColor: "#FF8FDA" }}></button>
                </div>
            
            <div className="col mt-2">
                <button className={`pad-btn ${props.padsOff[5] ? 'off' : ''}`} 
                    onClick={() => props.togglePad(5)} 
                    style={{ backgroundColor: "#E18FFF" }}></button>
            </div>

            <div className="col-2 d-flex justify-content-center align-items-center">
                <button className={`toggle-btn ${props.toggle2 ? "toggled" : ""}`}
                    style={{ backgroundColor: props.toggle2 ? '#f32525ff' : '#e0e0e0' }}
                    onClick={() => props.setToggle2(!props.toggle2)}>
                    <div className="thumb"></div>
                </button>
            </div>

            <div className="col mt-2">
                <button className={`pad-btn ${props.padsOff[6] ? 'off' : ''}`} 
                    onClick={() => props.togglePad(6)} 
                    style={{ backgroundColor: "#68FBA8" }}></button>
            </div>
            
            <div className="col mt-2">
                <button className={`pad-btn ${props.padsOff[7] ? 'off' : ''}`} 
                    onClick={() => props.togglePad(7)} 
                    style={{ backgroundColor: "#8FD6FF" }}></button>
            </div>
            
            <div className="col mt-2">
                <button className={`pad-btn ${props.padsOff[8] ? 'off' : ''}`} 
                    onClick={() => props.togglePad(8)} 
                    style={{ backgroundColor: "#A8FF8F" }}></button>
            </div>

            <div className="col-2 d-flex justify-content-center align-items-center">
                <button className={`toggle-btn ${props.toggle3 ? "toggled" : ""}`}
                    style={{ backgroundColor: props.toggle3 ? 'gold' : '#e0e0e0' }}
                    onClick={() => props.setToggle3(!props.toggle3)}>
                    <div className="thumb"></div>
                </button>
            </div>
        </>
    );
}

export default RadioButtons;