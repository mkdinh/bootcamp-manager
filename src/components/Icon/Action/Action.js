import React from "react";
import Fa from "react-fontawesome"
import CSSModules from "react-css-modules";
import styles from "./Action.css";

const Remove = props =>    
    <button styleName={`action ${props.icon}`} {...props}>
        <Fa name={props.icon}/>
    </button>

const options   = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
}

export default CSSModules(Remove, styles, options)


