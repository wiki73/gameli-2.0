import React, { useState, useEffect, useContext } from "react";
import './CenterPanel.css';
import levi from './levi.png';
import { useUser } from "../../context";

function CenterPanel() {
    // const { exp, money, setExp, setMoney, addExp, addMoney} = useUser();

    return (
        <div className="CenterPanel">
            <div className="level">1</div>
            <img className="img-ang" src={levi} alt="King" />
        </div>
    );
}

export default CenterPanel;