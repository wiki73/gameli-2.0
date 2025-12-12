import './LeftPanel.css';
import {useEffect, useState} from 'react';
import LeftPanelColumn from './LeftPanelColumn';
import ModalWindowAddTask from './ModalWindowAddTask';
import { supabase } from '../../supabase';

function LeftPanel({ littleTasks, mediumTasks, largeTasks, addTask }) {
    const USER_ID = "91b4b921-5098-4f79-84f2-2bc3ff90ac0f";
    const [littleGoals, setlittleGoals] = useState([]);
    const [MediumGoals, setMediumGoals] = useState([]);
    const [LargeGoals, setLargeGoals] = useState([]);
    useEffect(() => {
    let loaded = false; // защита от двойного вызова

    const loadGoals = async () => {
        const { data, error } = await supabase
            .from('goals')
            .select('large, text')
            .eq('id', USER_ID);

        if (error) {
            console.error(error);
            return;
        }

        if (loaded) return;
        loaded = true;

        const small = [];
        const medium = [];
        const large = [];

        data.forEach(item => {
            if (item.large === 'small') small.push(item.text);
            else if (item.large === 'medium') medium.push(item.text);
            else if (item.large === 'large') large.push(item.text);
        });

        // Обновляем состояния одним вызовом каждый
        setlittleGoals(small);
        setMediumGoals(medium);
        setLargeGoals(large);
    };

    loadGoals();
}, []);

    const addGoalsOnBd = async (des,size) =>  {
        console.log("Было")
        const {data,error} = await supabase
                .from("goals")
                .insert([{
                    id: USER_ID,
                    large: size,
                    text: des
                }])
            }

    const addGoals = (des, size) =>{
        console.log("Зашло 1" + size);
        if (size === "little") {
            console.log('Зашло')
            setlittleGoals(prev =>[...prev, des])
            addGoalsOnBd(des,"small")
            
        }
        if (size === "medium") {
            console.log('Зашло')
            setMediumGoals(prev =>[...prev, des])
            addGoalsOnBd(des,"medium")

        }
        if (size === "large") {
            console.log('Зашло')
            setLargeGoals(prev =>[...prev, des])
            addGoalsOnBd(des,"large")

        }
        // !!!!! Добавить добавление и в БД
    }


    return (
        <div className="LeftPanel">
            <div className='list-goals'>
                <LeftPanelColumn title={"Короткие"} tasks={littleGoals} />
                <LeftPanelColumn title={"Средние"} tasks={MediumGoals} />
                <LeftPanelColumn title={"Большие"} tasks={LargeGoals} />
            </div>
            <ModalWindowAddTask  addGoals={addGoals} />

        </div>
    );
}

export default LeftPanel;