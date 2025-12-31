import { getColorByLevel } from '../../../../constants/colors';
import { useAuth } from '../../../../contexts/auth-context';
import king from './king.png';
import './CenterPanel.css';

const CenterPanel = () => {
  const {
    user: { level, exp },
    handleUpdateUser,
  } = useAuth();
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
        onClick={() => handleUpdateUser({ exp: exp + 100 })}
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
