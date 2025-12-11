import { Children, createContext, useContext, useState, useEffect} from "react";
import { supabase } from './supabase';

const Context = createContext();

export function Provider({children}) {

    const [exp, setExp] = useState(0);
    const [money, setMoney] = useState(0);

    const USER_ID = "91b4b921-5098-4f79-84f2-2bc3ff90ac0f";
    useEffect(() => {
    const loadUser = async () => {
        const { data, error } = await supabase
        .from('users')
        .select('exp, money')
        .eq('id', USER_ID)
        .single();
        
        

        if (!error) {
        setExp(data.exp);
        setMoney(data.money);
        } else {
        console.log(error);
        }
    };

    loadUser();
    }, []);

    

    const addExp = async (amount) => {
        setExp(exp +amount);

        const { error } = await supabase
        .from('users')
        .update({ exp: exp+amount })
        .eq('id', USER_ID);

        if (error) {
        console.log(error);
        }
    };
    const addMoney = async (amount) => {
        setMoney(money +amount);

        const { error } = await supabase
        .from('users')
        .update({ money: money+amount })
        .eq('id', USER_ID);

        if (error) {
        console.log(error);
        }
    };

    return (
        <Context.Provider value={{
        exp,
        setExp,
        money,
        setMoney,
        addExp,
        addMoney
        }}>
            {children}
        </Context.Provider>
  );
}

export function useUser() {
  return useContext(Context);
}