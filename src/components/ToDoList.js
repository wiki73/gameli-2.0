import { useState, useRef, useEffect } from "react";
import './ToDoList.css';

export default function ToDoList() {
  const windowRef = useRef(null);
  const inputRef = useRef(null);

  const [position, setPosition] = useState({
    x: 150,
    y: 100,
  });

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  const handleAddTask = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setItems([...items, {
      id: Date.now(),
      text: trimmed,
      completed: false
    }]);
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
        <h3 onClick={() => {console.log(items)}}>План на день</h3>
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