import { useState, useRef, useEffect } from "react";
import { supabase } from '../supabase';
import './ToDoList.css';
import { useUser } from "../context";


export default function ToDoList() {
    const { addExp } = useUser();


  const windowRef = useRef(null);
  const inputRef = useRef(null);
  const topicRef = useRef(null);

  const getDateString = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString();
  };

  const today = getDateString(0);
  const tomorrow = getDateString(1);
  const yesterday = getDateString(-1);

  const [position, setPosition] = useState({
    x: 150,
    y: 100,
  });

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedDate, setSelectedDate] = useState(today);

  const loadingToDoList = async (date) => {
    const { data, error } = await supabase
      .from("tasks")
      .select('id, title, is_done, time, data, experience')
      .eq("data", date);
    if (error) {
      console.error(error);
      return;
    }
    const mappedData = data.map(item => ({
      id: item.id,
      text: item.title,
      completed: item.is_done,
      time: item.time,
      data: item.data,
      experience: item.experience || 0
    }));
    setItems(mappedData);
  };
  useEffect(() => {
    loadingToDoList(selectedDate);
  }, [selectedDate])
  const handleMouseDown = (e) => {
    if (e.target.closest('input, button')) return;
    setDragging(true);

    const rect = windowRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  const [openInput, setOpenInput] = useState(false);
  const [items, setItems] = useState([
    { id: 1, text: "Задача 1", completed: false, experience: 10 },
    { id: 2, text: "Задача 2", completed: false, experience: 10 },
    { id: 3, text: "Задача 3", completed: false, experience: 10 }
  ]);
  const [inputText, setInputText] = useState('');
  const [inputTopic, setInputTopic] = useState('');
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [timer, setTimer] = useState(0);

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

  const handleGoTask = (taskId) => {
    setActiveTaskId(taskId);
  };

  const handleFinishTask = () => {
    if (activeTaskId !== null) {
      toggleComplete(activeTaskId);
    }
    setActiveTaskId(null);
    setTimer(0);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddClick = () => {
    setOpenInput(true);
  };

  const addTaskToDB = async (task) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([{
        data: task.data,
        title: task.text,
        topic: task.topic,
        is_done: task.completed,
        time: task.time,
        experience: task.experience || 0
      }]);
    if (error) {
      console.error(error);
    }
  };

  const [previousItems, setPreviousItems] = useState(items);

  useEffect(() => {
    const changedItem = items.find(item => {
      const prevItem = previousItems.find(p => p.id === item.id);
      return prevItem && prevItem.completed !== item.completed;
    });

    if (changedItem) {
      const prevItem = previousItems.find(p => p.id === changedItem.id);
      const experienceGain = changedItem.completed ? changedItem.experience : -changedItem.experience;
      
      console.log("Чекбокс изменился:", changedItem.id, changedItem.completed, "опыт:", experienceGain);
      addExp(experienceGain);
      updateTaskInDB(changedItem.id, changedItem.completed, changedItem.experience);
    }

    setPreviousItems(items);
  }, [items]);

  const updateTaskInDB = async (id, completed, experience) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_done: completed, experience: experience })
      .eq("id", id);
    
    if (error) {
      console.error(error);
    }
  };


  const handleAddTask = (text, topic) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newItem = {
      id: Date.now(),
      data: selectedDate,
      text: trimmed,
      topic: topic.trim(),
      completed: false,
      time: 10,
      experience: 10
    };
    setItems([newItem, ...items]);
    addTaskToDB(newItem);
    setInputText('');
    setInputTopic('')
    setOpenInput(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask(inputText);
    } else if (e.key === 'Escape') {
      setOpenInput(false);
      setInputText('');
    }
  };



  const toggleComplete = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteTask = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div
      className="ToDoList"
      ref={windowRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: "280px",
        padding: "0px",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        zIndex: 9999,
      }}
    >
      <div className="header">
        <h3>План на день</h3>
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ fontSize: '12px', padding: '4px' }}>
          <option value={yesterday}>Вчера ({yesterday})</option>
          <option value={today}>Сегодня ({today})</option>
          <option value={tomorrow}>Завтра ({tomorrow})</option>
        </select>
      </div>

      {openInput && (
        <div className="div-new-task">
          <div>
            <input
              tabIndex={1}
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              type="text"
              placeholder="Новая задача..."
            />
           <input className='topic-input' tabIndex={2}
              ref={topicRef}
              value={inputTopic}
              onChange={(e) => setInputTopic(e.target.value)}
              // onKeyPress={handleKeyPress}
              type="text"
              placeholder="Сфера..."></input>
          </div>
          <button 
            className="btn-ok"
            onClick={() => handleAddTask(inputText, inputTopic)}
          >
            OK
          </button>
        </div>
      )}

      <div className="task-list">
        <TaskList items={items} onToggle={toggleComplete} onDelete={deleteTask} onGo={handleGoTask} />
      </div>

      {activeTaskId !== null && (
        <div className="active-task-overlay">
          <div className="active-task-window">
            <div className="active-task-content">
              <h2>{items.find(i => i.id === activeTaskId)?.text}</h2>
              <div className="timer">{formatTime(timer)}</div>
              <button className="btn-finish" onClick={handleFinishTask}>
                Закончить
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="btn-add-item" onClick={handleAddClick}>
        + Добавить
      </button>
    </div>
  );
}

function TaskList({ items, onToggle, onDelete, onGo }) {
  return (
    <ul className="tasks-ul">
      {items.length === 0 ? (
        <li className="empty-state">Нет задач</li>
      ) : (
        items.map((item) => (
          <li key={item.id} className={`task-item ${item.completed ? 'completed' : ''}`}>
            <label className="task-label">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggle(item.id)}
                className="task-checkbox"
              />
              <span className="task-text">{item.text}</span>
            </label>
            <div className="task-buttons">
              <button
                className="btn-go"
                onClick={() => onGo(item.id)}
                title="Начать"
              >
                GO
              </button>
              <button
                className="btn-delete"
                onClick={() => onDelete(item.id)}
                title="Удалить"
              >
                ✕
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}