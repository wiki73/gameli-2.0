import './LeftPanelColumn.css';

function LeftPanelItem({ description }) {
    return (
        <div className="LeftPanelItem">
            <p>{description}</p>
        </div>
    );
}

export default LeftPanelItem;