import React, { useState, useEffect, useContext } from "react";
import './CenterPanel.css';
import levi from './levi.png';
import { useUser } from "../../context";

function CenterPanel() {
    const { level, addExp} = useUser();
    let color = 'none';
    if (level < 3) color = "brown";
    else if (level < 5) color = "yellow";
    else if (level < 7) color = "violet";
    else if (level < 10) color = 'red';

    return (
        <div className="CenterPanel">
            <div className="level" style={{ border: `5px solid ${color}`, boxShadow: `0 0 20px ${color}, inset 0 0 25px ${color}`}}>{level}</div>
            <img className="img-ang" src={levi} alt="King" />
        </div>
    );
}

export default CenterPanel;