import './CenterPanel.css';

import { getColorByLevel } from '../../constants/colors';
import { useUser } from '../../context';
import king from './king.png';

const CenterPanel = () => {
  const { level, addExp } = useUser();
  const color = getColorByLevel(level);

  return (
    <div className='CenterPanel'>
      <div
        className='level'
        style={{
          border: `5px solid ${color}`,
          boxShadow: `0 0 20px ${color}, inset 0 0 25px ${color}`,
        }}
      >
        {level}
      </div>
      <button
        onClick={() => addExp(100)}
        type='button'
      >
        +++
      </button>
      <img
        alt='King'
        className='img-ang'
        src={king}
      />
    </div>
  );
};

export default CenterPanel;
