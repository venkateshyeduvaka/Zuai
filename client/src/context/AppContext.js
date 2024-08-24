import { createContext, useEffect, useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";
import backendDomain from "../common";

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    
  
    const customToast = (type, msg) => {
      return toast[type](msg, {
        style: {
          borderRadius: "6px",
          background: "#333",
          color: "#fff",
        },
        position: type === "success" ? "top-center" : "top-right",
      });
    };
  
    const getCurrentUser = async () => {
      try {
        const res = await fetch(backendDomain.auth.me, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setCurrentUser(data.data);
        } else {
          customToast("error", data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    
    useLayoutEffect(() => {
      getCurrentUser();
    }, []);
  
    return (
      <AppContext.Provider
        value={{
          currentUser,
          customToast,
          setCurrentUser,
          getCurrentUser,
        }}
      >
        {children}
      </AppContext.Provider>
    );
  };
  