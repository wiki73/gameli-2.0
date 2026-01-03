import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../../api';
import { useAuth } from '../../../contexts/auth-context';
import { supabase } from '../../../supabase';
import './ToDoList.css';

const ToDoList = () => {
  const {
    handleUpdateUser,
    user: { id: userId, exp },
  } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const [days, setDays] = useState([]);

  const [openInput, setOpenInput] = useState(false);
  const [items, setItems] = useState([]);
  const [inputText, setInputText] = useState('');
  const [inputTopic, setInputTopic] = useState('');
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const [finalTime, setFinalTime] = useState(0);

  const windowRef = useRef(null);
  const inputRef = useRef(null);
  const topicRef = useRef(null);

  const [position, setPosition] = useState({
    x: 150,
    y: 100,
  });

  useEffect(() => {
    api.getDay(userId).then(data => {
      setDays(data.dayLists);
      setSelectedDate(data.dayLists[0]?.date);
      setItems(data.tasks);
    });
  }, [userId]);

  const loadingToDoList = useCallback(
    async date => {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, is_done, time, date, experience')
        .eq('date', date)
        .eq('user_id', userId);

      if (error) {
        return;
      }

      setItems(
        data.map(item => ({
          ...item,
          text: item.title,
          completed: item.is_done,
          experience: item.experience || 0,
        })),
      );
    },
    [userId],
  );

  const newDayListToday = useCallback(async () => {
    const today = new Date();
    const { data } = await supabase
      .from('day_lists')
      .upsert({ date: today, user_id: userId }, { onConflict: 'user_id, date' })
      .select('*')
      .single();
    setDays(prev => [...prev, data]);
  }, [userId]);

  useEffect(() => {
    if (!selectedDate) return;
    if (selectedDate.includes('onToday')) {
      newDayListToday();
    } else {
      loadingToDoList(selectedDate);
    }
  }, [loadingToDoList, selectedDate, newDayListToday]);

  const handleMouseDown = e => {
    if (e.target.closest('input, button')) return;
    setDragging(true);

    const rect = windowRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = e => {
    if (!dragging) return;

    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (openInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openInput]);

  useEffect(() => {
    if (activeTaskId === null) {
      setTimer(0);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTaskId]);

  const handleGoTask = taskId => {
    setActiveTaskId(taskId);
  };

  const handleFinishTask = () => {
    setFinalTime(timer);
    setShowFinishModal(true);
  };

  const handleConfirmFinish = async () => {
    if (activeTaskId !== null) {
      const xpGain = getFinishXp(1, finalTime);
      const task = items.find(i => i.id === activeTaskId);

      if (task) {
        handleUpdateUser({ exp: exp + xpGain });

        const updatedItem = { ...task, completed: true, experience: xpGain };
        setItems(
          items.map(item => (item.id === activeTaskId ? updatedItem : item)),
        );

        await supabase
          .from('tasks')
          .update({ is_done: true, experience: xpGain })
          .eq('id', activeTaskId);
      }
    }
    setActiveTaskId(null);
    setTimer(0);
    setShowFinishModal(false);
  };

  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddClick = () => {
    setOpenInput(true);
  };

  const [previousItems, setPreviousItems] = useState(items);

  useEffect(() => {
    const changedItem = items.find(item => {
      const prevItem = previousItems.find(p => p.id === item.id);
      return prevItem && prevItem.completed !== item.completed;
    });

    if (changedItem) {
      const experienceGain = changedItem.completed
        ? changedItem.experience
        : -changedItem.experience;

      handleUpdateUser({ exp: exp + experienceGain });
      updateTaskInDB(
        changedItem.id,
        changedItem.completed,
        changedItem.experience,
      );
    }

    setPreviousItems(items);
  }, [handleUpdateUser, items, previousItems, exp]);

  const updateTaskInDB = async (id, completed, experience) => {
    await supabase
      .from('tasks')
      .update({ is_done: completed, experience: experience })
      .eq('id', id);
  };

  const handleAddTask = (text, topic) => {
    const trimmed = text.trim();
    if (!trimmed || !selectedDate) return;
    const newItem = {
      data: selectedDate,
      text: trimmed,
      topic: topic.trim(),
      completed: false,
      time: 10,
      experience: 10,
    };
    setItems([newItem, ...items]);
    addTaskToDB(newItem);
    setInputText('');
    setInputTopic('');
    setOpenInput(false);
  };

  const addTaskToDB = async task => {
    await supabase.from('tasks').insert([
      {
        date: task.data,
        title: task.text,
        topic: task.topic,
        is_done: task.completed,
        time: task.time,
        experience: task.experience || 0,
        user_id: userId,
      },
    ]);
  };
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleAddTask(inputText);
    } else if (e.key === 'Escape') {
      setOpenInput(false);
      setInputText('');
    }
  };

  const toggleComplete = id => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const deleteTask = async id => {
    setItems(items.filter(item => item.id !== id));

    await supabase.from('tasks').delete().eq('id', id);
  };

  const getFinishXp = (k, time) => {
    const res = k * 0.02777 * time;
    return Math.round(res * 1000) / 1000;
  };

  if (!selectedDate) {
    return null;
  }

  return (
    <div
      className='ToDoList'
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onPointerDown={handleMouseDown}
      onPointerLeave={handleMouseUp}
      onPointerMove={handleMouseMove}
      onPointerUp={handleMouseUp}
      ref={windowRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: '280px',
        padding: '0px',
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        zIndex: 9999,
      }}
    >
      <div className='header'>
        <h3>План на день</h3>
        <select
          onChange={e => setSelectedDate(e.target.value)}
          style={{ fontSize: '12px', padding: '4px' }}
          value={selectedDate}
        >
          {days?.map(item => (
            <option
              key={item.id}
              value={item.date}
            >
              {item.date}
            </option>
          ))}
          <option value='onToday'>Создать на сегодня</option>
        </select>
      </div>

      {openInput ? (
        <div className='div-new-task'>
          <div>
            <input
              onChange={e => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Новая задача...'
              ref={inputRef}
              tabIndex={1}
              type='text'
              value={inputText}
            />
            <input
              className='topic-input'
              onChange={e => setInputTopic(e.target.value)}
              placeholder='Сфера...'
              ref={topicRef}
              tabIndex={2}
              type='text'
              value={inputTopic}
            />
          </div>
          <button
            className='btn-ok'
            onClick={() => handleAddTask(inputText, inputTopic)}
            type='button'
          >
            OK
          </button>
        </div>
      ) : null}

      <div className='task-list'>
        <TaskList
          items={items}
          onDelete={deleteTask}
          onGo={handleGoTask}
          onToggle={toggleComplete}
        />
      </div>

      {activeTaskId !== null && (
        <div className='active-task-overlay'>
          <div className='active-task-window'>
            <div className='active-task-content'>
              <h2>{items.find(i => i.id === activeTaskId)?.text}</h2>
              <div className='timer'>{formatTime(timer)}</div>
              <button
                className='btn-finish'
                onClick={handleFinishTask}
                type='button'
              >
                Закончить
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinishModal ? (
        <div className='active-task-overlay'>
          <div className='active-task-window'>
            <div className='active-task-content'>
              <h2>Время задачи</h2>
              <div className='timer'>{formatTime(finalTime)}</div>
              <div className='block-topic'>
                <div>Сфера Прога</div>
                <div>Коефицент</div>
                <div>Итоговый опыт {getFinishXp(1, finalTime)}</div>
              </div>
              <button
                className='btn-finish'
                onClick={handleConfirmFinish}
                type='button'
              >
                Закончить
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        className='btn-add-item'
        onClick={handleAddClick}
        type='button'
      >
        + Добавить
      </button>
    </div>
  );
};

const TaskList = ({ items, onToggle, onDelete, onGo }) => {
  return (
    <ul className='tasks-ul'>
      {items.length === 0 ? (
        <li className='empty-state'>Нет задач</li>
      ) : (
        items.map(item => (
          <li
            className={`task-item ${item.completed ? 'completed' : ''}`}
            key={item.id}
          >
            <label className='task-label'>
              <input
                checked={item.completed}
                className='task-checkbox'
                onChange={() => onToggle(item.id)}
                type='checkbox'
              />
              <span className='task-text'>{item.text}</span>
            </label>
            <div className='task-buttons'>
              <button
                className='btn-go'
                onClick={() => onGo(item.id)}
                title='Начать'
                type='button'
              >
                GO
              </button>
              <button
                className='btn-delete'
                onClick={() => onDelete(item.id)}
                title='Удалить'
                type='button'
              >
                ✕
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default ToDoList;
