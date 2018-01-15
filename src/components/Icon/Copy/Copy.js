import React from "react";
import Fa from "react-fontawesome"
import CSSModules from "react-css-modules";
import styles from "./Copy.css";

const Copy = props =>    

    <Fa name="copy" 
    styleName={`icon-file copy`} {...props}/>
  

const options   = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
}

export default CSSModules(Copy, styles, options)


