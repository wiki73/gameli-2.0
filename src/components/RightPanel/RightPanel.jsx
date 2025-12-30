import { useState } from 'react';

import './RightPanel.css';
import { useUser } from '../../context';

import ModalInventory from './ModalInventory';
import ModalList from './ModalList';
import RightPanelLevel from './RightPanelLevel';

const RightPanel = () => {
  const { exp, money } = useUser();
  const [openModalWindowInvent, setOpenModalWindowInvent] = useState(false);
  const [openModalWindowList, setOpenModalWindowList] = useState(false);

  const handleInvent = () => {
    setOpenModalWindowInvent(true);
  };

  const handleList = () => {
    setOpenModalWindowList(true);
  };

  return (
    <div className='RightPanel'>
      <div className='state'>
        <button
          className='state-item'
          type='button'
        >
          Опыт: {Number(exp).toFixed(3)}
        </button>
        <button
          className='state-item'
          type='button'
        >
          Деньги: {money}
        </button>
        <button
          className='btn state-item'
          onClick={handleInvent}
          type='button'
        >
          Инвентарь
        </button>
        <button
          className='state-item'
          onClick={handleList}
          type='button'
        >
          Послужной список
        </button>
      </div>
      <div className='list-item'>
        <RightPanelLevel
          level={1000}
          subject='Спорт'
        />
        <RightPanelLevel
          level={15}
          subject='Экономика'
        />
        <RightPanelLevel
          level={4}
          subject='Фигма'
        />
        <RightPanelLevel
          level={24}
          subject='Чтение'
        />
        <RightPanelLevel
          level={31}
          subject='Прога'
        />
        <RightPanelLevel
          level={11}
          subject='Пчёлы'
        />
        <RightPanelLevel
          level={14}
          subject='Скалалазанье'
        />
        <RightPanelLevel
          level={28}
          subject='Зарядка'
        />
      </div>
      {openModalWindowInvent ? (
        <ModalInventory
          isOpen={openModalWindowInvent}
          onClose={() => setOpenModalWindowInvent(false)}
        />
      ) : null}
      {openModalWindowList ? (
        <ModalList
          isOpen={openModalWindowList}
          onClose={() => setOpenModalWindowList(false)}
        />
      ) : null}
    </div>
  );
};

export default RightPanel;
