import {useState, useEffect} from "react";
import './RightPanel.css';
import RightPanelLevel from "./RightPanelLevel";
import { useUser} from "../../context";




function RightPanel() {
    const { exp, money, setExp, setMoney, addExp, addMoney} = useUser();
    const [openModalWindowInvent, setOpenModalWindowInvent] = useState(false);
    const [openModalWindowList, setOpenModalWindowList] = useState(false)

    const handleInvent = () => {
        setOpenModalWindowInvent(true);
    }  

    const handleList = () => {
        console.log("List clicked");
        setOpenModalWindowList(true);
    }

    
    return (
        <div className="RightPanel">
            {/* <h2>Right Panel</h2> */}
            <div className="state">
                {/* <div className="state-item">
                    <div>Опыт: {exp}</div>
                </div> */}
                <button className="state-item">Опыт: {exp}</button>
                <button className=" state-item">Деньги: {money}</button>
                <button className="btn state-item" onClick={handleInvent}>Инвентарь</button>
                <button className="state-item" onClick={handleList}>Послужной список</button>
            </div>
            <div className="list-item">
                <RightPanelLevel level={1} subject={"Спорт"}/>
                <RightPanelLevel level={15} subject={"Экономика"}/>
                <RightPanelLevel level={4} subject={"Фигма"}/>
                <RightPanelLevel level={24} subject={"Чтение"}/>
                <RightPanelLevel level={31} subject={"Прога"}/>
                <RightPanelLevel level={11} subject={"Пчёлы"}/>
                <RightPanelLevel level={14} subject={"Скалалазанье"}/>
                <RightPanelLevel level={28} subject={"Зарядка"}/>
            </div>
            {openModalWindowInvent && <ModalWinsowInvent isOpen={openModalWindowInvent} onClose={() => setOpenModalWindowInvent(false)} />}
            {openModalWindowList && <ModalWinsowList isOpen={openModalWindowList} onClose={() => setOpenModalWindowList(false)} />}
        </div>
    );
}

function ModalWinsowInvent({ isOpen, onClose }) {
    useEffect(() => {
            function handleEscape(event) { 
                if (event.key === 'Escape') onClose();
            }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    useEffect(() => {
            const timer = setTimeout(() => {
                onClose();
            }, 1000);
            return () => clearTimeout(timer);
        }, [onClose])
    return (
        <>
        <div className="modal-invent">
            Inventory Content
        </div>
        </>
    );
}

function ModalWinsowList({ isOpen, onClose }) {
    useEffect(() => {
            function handleEscape(event) { 
                if (event.key === 'Escape') onClose();
            }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);
    return (
        <>
        <div className="modal-list">
            List Content
        </div>
        </>
    );
}

export default RightPanel;