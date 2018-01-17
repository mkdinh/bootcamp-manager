import React from "react";
import Fa from "react-fontawesome"
import CSSModules from "react-css-modules";
import styles from "./Remove.css";

const Remove = props =>    
    <button styleName={`icon-file remove ${props.ispushed ? "pushed": ""}`} {...props}>
        <Fa name="remove"/>
    </button>

const options   = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
}

export default CSSModules(Remove, styles, options)


