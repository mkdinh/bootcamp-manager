import React from "react";
import Fa from "react-fontawesome";
import styles from "./Arrow.css";
import CSSModules from "react-css-modules";

const Arrow = props => 
    props.visible ?
        <div styleName={`arrow ${props.direction}`}>
            <Fa styleName="arrow-icon" 
            name={`chevron-${props.direction}`}/>
        </div>
    :
        null

const options = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
};

export default CSSModules(Arrow, styles, options);