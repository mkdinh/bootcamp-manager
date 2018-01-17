import React from "react";
import Action from "../../Icon";
import CSSModules from "react-css-modules";
import styles from "./Option.css";

const Option = props => 
    <div styleName="option">
        {props.role === "instructor" ?
            <div>
                <Action ispushed={props.ispushed} icon="copy" onClick={props.handleCopy}/>
            </div>
        :
            <div>
                <Action ispushed={props.ispushed} icon="remove" onClick={props.handleRemove}/>
            </div>
        }
    </div>

const options = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
}

export default CSSModules(Option, styles, options)