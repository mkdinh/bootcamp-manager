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
                    // check if there is actually a solved and unsolved folder
                    // if there isn't then don't show status
                    <span styleName="status-wrapper">
                        <span styleName={`
                            option-status 
                            ${props.hasUnsolved ? "unsolved" : ""}
                            ${props.existsUnSolved ? "" : "hidden"}`}>
                            <Fa name=""/>unsolved
                        </span> 

                        <span styleName={
                            `option-status 
                            ${props.hasSolved ? "solved" : ""}
                            ${props.existsSolved ? "" : "hidden"}`}>
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