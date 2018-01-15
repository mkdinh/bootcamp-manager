import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./Explorer.css";

const options = {
    allowMultiple: true
};

let Explorer = (props) => 
    <div styleName="explorer">
        {props.children}
    </div>

Explorer = CSSModules(Explorer, styles, options);

export default Explorer ;
