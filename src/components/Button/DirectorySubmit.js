import React from "react";
import CSSModules from "react-css-modules";
import styles from "./Button.css";

const DirectoryButton = props => 
    <button styleName="button directory" {...props}>
        {props.content}
    </button>

const options = {
    allowMultiple: true
};

export default CSSModules(DirectoryButton, styles, options);