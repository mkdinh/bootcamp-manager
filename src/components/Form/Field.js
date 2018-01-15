import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./Form.css";

const Field = props => 
    <div styleName={`field ${props.inline ? "inline" : ""}`}> 
        {props.children} 
    </div>

const options = {
    allowMultiple: true
};

export default CSSModules(Field, styles, options);
