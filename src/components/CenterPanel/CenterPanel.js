import React, { useState, useEffect, useContext } from "react";
import './CenterPanel.css';
import levi from './levi.png';


 const handleInvent = (setOpenModalWindowInvent) => {
    console.log("Inventory clicked");
    setOpenModalWindowInvent(true);
 }
 const handleStore = (setOpenModalWindowStore) => {
    console.log("store clicked");
    setOpenModalWindowStore(true);
 }
 const handleList = (setOpenModalWindowList) => {
    console.log("List clicked");
    setOpenModalWindowList(true);
 }
function CenterPanel() {
    const [xp, setXp] = useState(0);
    const [money, setMoney] = useState(0);
    const [openModalWindowInvent, setOpenModalWindowInvent] = useState(false);
    const [openModalWindowStore, setOpenModalWindowStore] = useState(false);
    const [openModalWindowList, setOpenModalWindowList] = useState(false)

    return (
        <div className="CenterPanel">
            <h2>Center Panel</h2>
            <img className="img-ang" src={levi} alt="King" />
            <div className="div-xp-and-money">
                <p> Опыт</p>
                <p> Денег</p>
            </div>
            <div className="div-inventory-shop-records">
                <div onClick={()=> handleInvent(setOpenModalWindowInvent)}>Инвентарь</div>
                <div onClick={()=> handleStore(setOpenModalWindowStore)}>Магазин</div>
                <div onClick={()=> handleList(setOpenModalWindowList)}>Послужной список</div>
            </div>
        
            {openModalWindowInvent && <ModalWinsowInvent isOpen={openModalWindowInvent} onClose={() => setOpenModalWindowInvent(false)} />}
            {openModalWindowStore && <ModalWinsowStore isOpen={openModalWindowStore}  onClose={() => setOpenModalWindowStore(false)}/>}
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
function ModalWinsowStore({ isOpen, onClose }) {
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
        <div className="modal-store">
            Store Content
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


export default CenterPanel;