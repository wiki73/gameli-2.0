import { useState, useRef, useEffect } from "react";
import { supabase } from '../supabase';
import './ToDoList.css';

export default function ToDoList() {
  const windowRef = useRef(null);
  const inputRef = useRef(null);

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
      .select('id, title, is_done, time, data')
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
      data: item.data
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
    { id: 1, text: "Задача 1", completed: false },
    { id: 2, text: "Задача 2", completed: false },
    { id: 3, text: "Задача 3", completed: false }
  ]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (openInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openInput]);

  const handleAddClick = () => {
    setOpenInput(true);
  };

  const addTaskToDB = async (task) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([{
        data: task.data,
        title: task.text,
        is_done: task.completed,
        time: task.time
      }]);
    if (error) {
      console.error(error);
    }
  };

  const handleAddTask = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newItem = {
      id: Date.now(),
      data: selectedDate,
      text: trimmed,
      completed: false,
      time: 10
    };
    setItems([newItem, ...items]);
    addTaskToDB(newItem);
    setInputText('');
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
          <input
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            type="text"
            placeholder="Новая задача..."
          />
          <button 
            className="btn-ok"
            onClick={() => handleAddTask(inputText)}
          >
            OK
          </button>
        </div>
      )}

      <div className="task-list">
        <TaskList items={items} onToggle={toggleComplete} onDelete={deleteTask} />
      </div>

      <button className="btn-add-item" onClick={handleAddClick}>
        + Добавить
      </button>
    </div>
  );
}

function TaskList({ items, onToggle, onDelete }) {
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
            <button
              className="btn-delete"
              onClick={() => onDelete(item.id)}
              title="Удалить"
            >
              ✕
            </button>
          </li>
        ))
      )}
    </ul>
  );
}