import React, { Component } from "react";
import List from "../List";
import CSSModules from "react-css-modules";
import styles from "./Expand.css";

const options = {
    allowMultiple: true
};

const Expand = props => {
    return (
        props.visible ?
            <div styleName="item-expand">
                <List {...props}/>
            </div>
        :
            null
    )
}

export default CSSModules(Expand, styles, options)
