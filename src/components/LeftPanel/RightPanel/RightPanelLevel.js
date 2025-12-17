import React from "react";
import './RightPanel.css';

function RightPanelLevel({ level, subject }) {
    let color = 'none';

    if (level < 10) color = "brown";
    else if (level < 20) color = "yellow";
    else if (level < 30) color = "blue";
    else color = 'violet';

    return (
        <div className="RightPanelItem">
            <div className="circl" style={{ border: `5px solid ${color}`, boxShadow: `0 0 20px ${color}, inset 0 0 25px ${color}`}}>
                <p>{level}</p>
            </div>
            <p>{subject}</p>
        </div>
    );
}


export default RightPanelLevel;