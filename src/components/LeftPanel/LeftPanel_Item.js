import React, { useContext } from 'react';
import './LeftPanelColumn.css';



function LeftPanelItem({itemKey, description}) {

    return (
        <div className="LeftPanelItem">
            <p>{description}</p>
        </div>
    )
}

export default LeftPanelItem;