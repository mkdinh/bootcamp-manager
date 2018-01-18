import React from "react";
import Action from "../../Icon";
import CSSModules from "react-css-modules";
import styles from "./Option.css";
import Fa from "react-fontawesome";

const Option = props => 
    <div styleName="option">
        {props.role === "instructor" ?
            <div>
                <Action ispushed={props.ispushed} icon="copy" onClick={props.handleCopy}/>
            </div>
        :
            <div>
                {props.clevel === 1 ?
                    <span styleName="status-wrapper">
                        <span styleName={`option-status ${props.hasUnsolved ? "unsolved" : ""}`}>
                            <Fa name=""/>unsolved
                        </span> 
                        <span styleName={`option-status ${props.hasSolved ? "solved" : ""}`}>
                            solved
                        </span>
                    </span> 
                : null}

                <Action ispushed={props.ispushed} icon="remove" onClick={props.handleRemove}/>
            </div>
        }
    </div>

const options = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
}

export default CSSModules(Option, styles, options)