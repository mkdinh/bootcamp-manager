import React from "react";
import Fa from "react-fontawesome"
import CSSModules from "react-css-modules";
import styles from "./File.css";

const FileIcon = props => {
    const fileIcon = () => {
        switch(props.ext) {
            case ".html": case ".css": case ".js": case ".json":
                return "file-code-o";
            case ".md":  
                return "file-text-o";
            case ".txt":
                return "file-text-o"
            case ".png": case ".jpg": case ".jpeg": case".gif":
                return "file-image-o"
            case ".pptx" || ".ppt":
                return "file-powerpoint-o"
            case ".xlsx":
                return "file-excel-o"
            case ".mov":
                return "file-movie-o"
            default:
                return "file-o";
        };
    }
    
    let cssName= props.type === "file" ? props.ext.replace(".","") : "dir";

    return (
        props.type === "dir" ?
            <Fa name={props.expand === "true" ? "folder-open-o" : "folder-o"} 
            styleName={`icon-file dir ${props.ispushed ? "pushed" : ""}`} {...props}/>
        :
            <Fa name={fileIcon()} styleName={`icon-file ${cssName}`} {...props}/>
    )
};

const options   = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
}

export default CSSModules(FileIcon, styles, options)


