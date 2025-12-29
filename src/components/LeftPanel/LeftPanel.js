import './LeftPanel.css';
import { useEffect, useState } from 'react';
import LeftPanelColumn from './LeftPanelColumn';
import ModalWindowAddTask from './ModalWindowAddTask';
import { supabase } from '../../supabase';
import { TASK_SIZES, DB_TASK_SIZES } from '../../constants/taskSizes';
import { useUser } from '../../context';

function LeftPanel() {
    const { userId } = useUser();
    const [littleGoals, setLittleGoals] = useState([]);
    const [mediumGoals, setMediumGoals] = useState([]);
    const [largeGoals, setLargeGoals] = useState([]);
    useEffect(() => {
        let loaded = false; // защита от двойного вызова

        const loadGoals = async () => {
            if (!userId) return;
            const { data, error } = await supabase
                .from('goals')
                .select('large, text')
                .eq('id', userId);

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

            setLittleGoals(small);
            setMediumGoals(medium);
            setLargeGoals(large);
        };

        loadGoals();
    }, [userId]);

    const addGoalsOnBd = async (des, size) => {
        const { data, error } = await supabase
            .from("goals")
            .insert([{
                id: userId,
                large: size,
                text: des
            }]);

        if (error) {
            console.error(error);
        }
    };

    const addGoals = (des, size) => {
        const dbSize = DB_TASK_SIZES[size];

        if (size === TASK_SIZES.LITTLE) {
            setLittleGoals(prev => [...prev, des]);
            addGoalsOnBd(des, dbSize);
        } else if (size === TASK_SIZES.MEDIUM) {
            setMediumGoals(prev => [...prev, des]);
            addGoalsOnBd(des, dbSize);
        } else if (size === TASK_SIZES.LARGE) {
            setLargeGoals(prev => [...prev, des]);
            addGoalsOnBd(des, dbSize);
        }
    };


    return (
        <div className="LeftPanel">
            <div className='list-goals'>
                <LeftPanelColumn title={"Короткие"} tasks={littleGoals} />
                <LeftPanelColumn title={"Средние"} tasks={mediumGoals} />
                <LeftPanelColumn title={"Большие"} tasks={largeGoals} />
            </div>
            <ModalWindowAddTask addGoals={addGoals} />
        </div>
    );
}

export default LeftPanel;