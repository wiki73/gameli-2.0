import './LeftPanelColumn.css';
import LeftPanelItem from './LeftPanel_Item';

const LeftPanelColumn = ({ title, tasks }) => {
  return (
    <div className="LeftPanelColumn">
      <h2>{title}</h2>
      <div className='task-list'>
        {tasks.length > 0 ? (
          tasks.map((item, index) => (
            <LeftPanelItem
              description={item}
              key={index}
            />
          ))
        ) : (
          <p>У Вас нет целей</p>
        )}
      </div>
    </div>
  );
};

export default LeftPanelColumn;