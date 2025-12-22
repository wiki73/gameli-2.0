import './CenterPanel.css';
import king from './king.png';
import { useUser } from "../../context";
import { getColorByLevel } from "../../constants/colors";

function CenterPanel() {
    const { level, addExp } = useUser();
    const color = getColorByLevel(level);

    return (
        <div className="CenterPanel">
            <div className="level" style={{ border: `5px solid ${color}`, boxShadow: `0 0 20px ${color}, inset 0 0 25px ${color}`}}>{level}</div>
            <button onClick={() => addExp(100)}>+++</button>
            <img className="img-ang" src={king} alt="King" />
        </div>
    );
}

export default CenterPanel;