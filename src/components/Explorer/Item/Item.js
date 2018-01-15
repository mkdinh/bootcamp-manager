import React, { Component } from "react";
import Expand from "../Expand";
import FileType from "../../Icon/File";
import Option from "../Option";
import CSSModules from "react-css-modules";
import styles from "./Item.css";

const options = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
};

@CSSModules(styles, options)

class Item extends Component {

    state = {
        expand: false,
        visible: true,
    }

    toggleExpand = ev => this.setState({ expand: !this.state.expand })

    handleCopy = ev => {
        ev.stopPropagation();
        let info = this.props.item.__info;
        let cWeek = this.props.week;

        this.props.copy(info.rel)
        .then( () => this.props.initialize(cWeek) )
        .catch(err => console.error(err) );
    }

    handleRemove = ev => {
        ev.stopPropagation();
        let info = this.props.item.__info;
        let cWeek = this.props.week;

        this.props.remove(info.rel)
        .then( () => this.props.initialize(cWeek) )
        .catch(err => console.error(err) );
    }

    handleDirClick = ev => {
        ev.stopPropagation();
        this.toggleExpand();
    }

    handleFileClick = ev => {
        ev.stopPropagation()
    }

    render() {
        const file = this.props.item;
        const numFile = Object.keys(file).length;
        const info = file.__info;
        const isDir = file.__info.type === "dir";

        return (
            
            <li onClick={isDir ? this.handleDirClick : this.handleFileClick} 
            styleName={`
                ${this.state.expand && this.props.clevel === 1 ? "bordered" : ""}
                item ${this.state.expand ? "expand" : ""}
                clevel-${this.props.clevel}`
            }>
                <div styleName="item-content">
                    <FileType ext={info.ext} 
                    type={info.type} 
                    expand={this.state.expand ? "true" : "false"}/> 

                    <span styleName="item-name">{info.name}</span>
        
                    <Option rel={info.rel} 
                    role={this.props.role}
                    handleCopy={this.handleCopy} 
                    handleRemove={this.handleRemove}/>
                </div>

                {/* only expand on directory containing file */}
                {isDir && numFile > 1?
                    <Expand visible={this.state.expand} data={file} {...this.props}/>
                : null}
                
            </li>
        )
    }
};

export default Item;