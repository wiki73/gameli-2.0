import { Children, createContext, useContext, useState, useEffect } from "react";
import { supabase } from './supabase';
// import { userId } from './config/env';
import { getLevelByExp as calculateLevelByExp } from './constants/levelRanges';

const Context = createContext();

export function Provider({children}) {

    const [userId, setUserId] = useState(null); 
    const [exp, setExp] = useState(0);
    const [money, setMoney] = useState(0);
    const [level, setLevel] = useState(0);

    useEffect(() => {
        const getUser = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                console.log("userId установлен:", user.id);  // Проверить
            }
        };
        getUser();
}, []);      

    
    useEffect(() => {
        if (!userId) {
        console.log("userId ещё не готов:", userId);
        return;
    }
        const loadUser = async () => {
            console.log("ggggg" + userId);
            const { data, error } = await supabase
            .from('users')
            .select('exp, money, level')
            .eq('id', userId)
            .single();
        
        

        if (!error) {
            setExp(data.exp);
            setMoney(data.money);
            await updateLevelByExp(data.exp);
        } else {
            console.error(error);
        }
    };

    loadUser();
    }, [userId]);

    

    const addExp = async (amount) => {
        const newExp = exp + amount;
        setExp(newExp);
        await updateLevelByExp(newExp);
        
        const { error } = await supabase
            .from('users')
            .update({ exp: newExp })
            .eq('id', userId);

        if (error) {
            console.error(error);
        }
    };

    const addMoney = async (amount) => {
        const newMoney = money + amount;
        setMoney(newMoney);

        const { error } = await supabase
            .from('users')
            .update({ money: newMoney })
            .eq('id', userId);

        if (error) {
            console.error(error);
        }
    };

    const updateLevelByExp = async (expAmount) => {
        const lev = calculateLevelByExp(expAmount);
        setLevel(lev);
        
        const { error } = await supabase
            .from("users")
            .update({ level: lev })
            .eq('id', userId);

        if (error) {
            console.error(error);
        }
    };

    return (
        <Context.Provider value={{
        exp,
        setExp,
        money,
        setMoney,
        addExp,
        addMoney,
        level
        }}>
            {children}
        </Context.Provider>
  );
}



export function useUser() {
  return useContext(Context);
}