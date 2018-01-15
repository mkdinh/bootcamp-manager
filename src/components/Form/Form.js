// import react
//--------------------------------------------------------
import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./Form.css";

const Form = props =>
        <form styleName={`form-wrapper ${props.inline ? "inline" : ""}`}>
            {props.children}
        </form>

const options = {
    allowMultiple: true
};

export default CSSModules(Form, styles, options);
