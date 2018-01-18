import React from "react";
import CSSModules from "react-css-modules";
import styles from "./Header.css";

const options = {
    handleNotFoundStyleName: "ignore"
};

let Header = props => {

    const style = {
        fontWeight: "bold",
        textTransform: "uppercase",
        fontFamily: "Arial",
        color: props.color || "#ffffff",
        fontSize: props.size,
        margin: props.margin || "0"
    }

    return (
        <h1 styleName="header" style={style}>{props.content}</h1>
    )
};

Header = CSSModules(Header, styles, options);

export { Header };