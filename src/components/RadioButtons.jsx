function RadioButtons({padsOff,
  togglePad,
  toggle1,
  setToggle1,
  toggle2,
  setToggle2,
  toggle3,
  setToggle3}) {
    return(
        <>
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
        </>
    );
}

export default RadioButtons;