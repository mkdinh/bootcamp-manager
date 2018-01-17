import React from "react";
import CSSModules from "react-css-modules";
import Fa from "react-fontawesome";
import styles from "./Item.css";
const Item = props => {

    const subHeader = () => {
        try {
            let subheader = props.content.match(/#+/)[0];
            let level = subheader.length;
            switch(level) {
                case 5:
                    return "subheader one";
                case 4:
                    return "subheader two";
                case 3:
                    return "subheader three";
                case 2:
                    return "subheader four";  
                case 1:
                    return "subheader five";
                default:
                    return "";
            }
        } catch(err) {
            return "";
        }
    }

    const removeMarkup = () => {
        let content = props.content;
        // remove hash
        content = content.replace(/#/g, "");
        //remove links
        content = content.replace(/\<!--links-->.*\r/g, "");
        //remove images
        content = content.replace(/\!.*/g, "");    
        return content;
    }

    return (
        <p styleName={`content-item ${subHeader()}`}>{removeMarkup()}</p>
    )
}   

const options   = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
}

export default CSSModules(Item, styles, options)


