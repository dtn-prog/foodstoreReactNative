import { Children, createContext } from "react";
import { useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [carts, setCarts] = useState([]);

    const value = {carts,}

    return (<CartContext.Provider value={value}>{children}</CartContext.Provider>)
}
