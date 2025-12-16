import React, { useState, useEffect, useContext } from "react";
import './CenterPanel.css';
import levi from './levi.png';
import { useUser } from "../../context";

function CenterPanel() {
    // const { exp, money, setExp, setMoney, addExp, addMoney} = useUser();

    return (
        <div className="CenterPanel">
            <div className="div-xp-and-money">
                {/* <button className="btn-exp" onClick={() => addExp(10)}>{exp} Опыт</button> */}
                {/* <button className="btn-exp" onClick={() => addMoney(10)}>{money} Денег</button> */}
            </div>
            <img className="img-ang" src={levi} alt="King" />
        </div>
    );
}

export default CenterPanel;