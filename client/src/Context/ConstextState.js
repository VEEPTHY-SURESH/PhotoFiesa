import React,{useState} from "react";
import UserId from "./Context";

const ContextState = (props)=>{
    const [uid,setUid] = useState("");
    return(
        <UserId.Provider value={{uid,setUid}}>
            {props.children}
        </UserId.Provider>
    )
}

export default ContextState;