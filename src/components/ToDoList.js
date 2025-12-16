import { useState, useRef, useEffect } from "react";
import './ToDoList.css';


export default function ToDoList() {
  const windowRef = useRef(null);

  const [position, setPosition] = useState({
    x: 450,
    y: 100,
  });

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
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

  const [openInput, setopenInput] = useState(false);
  const [items, setItems] = useState(["Задача","Задача", "Задача"])
  const [inputText, setInputText] = useState('')
  const handleClick =() =>  {
      setopenInput(true);

  }
  const handleOk = (text) => {
    console.log("click")
    setItems([...items, text]);
    setInputText('');

  }


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
        width: "250px",
        padding: "10px",
        background: "#fff",
        border: "2px solid #444",
        borderRadius: "8px",
        cursor: "grab",
        userSelect: "none",
        zIndex: 9999,
      }}
    >
      <div>
        <h3>План на день</h3>
        {openInput && ( 
            <div className="div-new-task">
              <input value={inputText} onChange={(e)=> {setInputText(e.target.value)}} type="text" placeholder="Название задачи"></input>
              <button onClick={()=> {handleOk(inputText)}}>OK</button>
            </div>
        )}
      </div>
        <TaskList items={items}/>
        <button onClick={handleClick}>Добавить</button>
    </div>
  );
}

function TaskList({items}) {

  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{i+1} {item}</li>    
      ))}
      
    </ul>
  );
}