import './RightPanel.css';
import { getColorBySubjectLevel } from '../../constants/colors';

const RightPanelLevel = ({ level, subject }) => {
  const color = getColorBySubjectLevel(level);

  return (
    <div className="RightPanelItem">
      <div className="circl" style={{ border: `5px solid ${color}`, boxShadow: `0 0 20px ${color}, inset 0 0 25px ${color}`}}>
        <p>{level}</p>
      </div>
      <p>{subject}</p>
    </div>
  );
};


export default RightPanelLevel;