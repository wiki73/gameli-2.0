import { Children, createContext, useContext, useState, useEffect} from "react";
import { supabase } from './supabase';
import { userId } from './config/env';

const Context = createContext();

export function Provider({children}) {

    const [exp, setExp] = useState(0);
    const [money, setMoney] = useState(0);
    const [level, setLevel] = useState(0);
    useEffect(() => {
    const loadUser = async () => {
        const { data, error } = await supabase
        .from('users')
        .select('exp, money, level')
        .eq('id', userId)
        .single();
        
        

        if (!error) {
        setExp(data.exp);
        setMoney(data.money);
        getLeverByEx(data.exp);
        } else {
        console.log(error);
        }
    };

    loadUser();
    }, []);

    

    const addExp = async (amount) => {
        setExp(exp +amount);
        getLeverByEx(exp+amount)
        const { error } = await supabase
        .from('users')
        .update({ exp: exp+amount })
        .eq('id', userId);

        if (error) {
        console.log(error);
        }
    };
    const addMoney = async (amount) => {
        setMoney(money +amount);

        const { error } = await supabase
        .from('users')
        .update({ money: money+amount })
        .eq('id', userId);

        if (error) {
        console.log(error);
        }
    };

    const getLeverByEx  = (exp) => {
    let lev = 1;
    if (exp < 100) {
        lev = 1;
    }
    else if (exp < 300) {
        lev= 2
    }
    else if (exp < 500) {
        lev = 3
    }
    else if(exp < 600) {
        lev = 4
    }
    else if (exp < 1000) {
        lev = 5
    }
    else if (exp < 1200) {
        lev= 7
    }
    else lev = 1;
    setLevel(lev);
    const {error} = supabase
    .from("users")
    .update({level: lev})
    .eq('id', userId);

}

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