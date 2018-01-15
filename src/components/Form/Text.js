// import react
//--------------------------------------------------------
import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./Form.css";

const Text = props => 
    <div styleName="text-wrapper">
        <label styleName="label">{props.label}</label>
        <input 
        type="text"
        value={props.value}
        readOnly={props.readOnly ? "true" : undefined}
        styleName="input text" 
        onChange={props.onChange}/>
    </div>

const options = {
    allowMultiple: true
};

export default CSSModules(Text, styles, options);