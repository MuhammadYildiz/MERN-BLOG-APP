import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../url";

export const UserContext = createContext({ user: null, setUser: () => {} });

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUser();
    }, []); // Remove 'user' from the dependency array

    const getUser = async () => {
        try {
            const response = await axios.get(URL + "/api/auth/refetch", { withCredentials: true });
            setUser(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
