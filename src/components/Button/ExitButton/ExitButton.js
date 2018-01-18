import React from "react";
import electron from "electron";
import Fa from "react-fontawesome";
import CSSModules from "react-css-modules";
import styles from "./ExitButton.css";

let ExitButton = () => {

    const handleClick = () => {
        const app = electron.remote.app;
        app.quit()
    }

    return (
        <Fa styleName="button-exit" name="remove" onClick={handleClick}/>
    )
};

ExitButton = CSSModules(ExitButton, styles);

export { ExitButton };