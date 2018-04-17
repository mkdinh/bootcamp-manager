import React from "react";
import CSSModules from "react-css-modules";
import Fa from "react-fontawesome";
import styles from "./GitStatus.css";

let GitStatus = props => {

    let unique = (value, index, self) => {
        return self.indexOf(value) === index;
    }

    let findUniqueNum = (array, params) => {
        // find unique paths
        if (array) {
            let regEx = new RegExp(`.*?\/${params}\/`, "gi");
            return array
            .map(el => el.match(regEx))
            .filter(el => el)
            .map(el => el[0])
            .filter( unique )
            .length
        }
    }

    let display = ["conflicted", "created", "deleted"];
    let { created, files } = props.status;
    let numTotal = files.length;

    let numUnsolved = findUniqueNum(created, "Unsolved");
    let numSolved = findUniqueNum(created, "Solved");

    return (
        <div styleName="git-status">
            <div styleName="git-status-total">
                <span styleName="git-status-num total"> Total: {numTotal} </span>
                <span styleName="git-status-num unsolved"> Unsolved: {numSolved} </span>
                <span styleName="git-status-num solved"> Solved: {numSolved} </span> 
            </div>
            <div styleName="git-status-list">
                {display.map(key => 
                    Array.isArray(props.status[key]) ?
                        props.status[key].map(file => 
                            <p styleName={`git-status-item ${key}`}>
                            {file}
                            </p>
                        )
                    : null
                )}
            </div>        
        </div>
    )
}   

const options   = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
}

GitStatus = CSSModules(GitStatus, styles, options);

export { GitStatus };


