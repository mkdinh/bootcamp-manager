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
        hasUnsolved: false,
        existsUnsolved: false,
        hasSolved: false,
        existsUnsolved: false
    }
    
    componentDidMount() {
        this.checkStatus(this.props);
    }

    componentWillReceiveProps(props) {
        this.checkStatus(props);
    }

    checkStatus = props => {
        // check if students have solved or unsolved folder
        if(props.role === "student" && props.clevel === 1) {
            let item = props.item;

            let existsUnsolved = this.props.exists(item.__info.rel, "unsolved");
            let existsSolved = this.props.exists(item.__info.rel, "solved");
            // console.log(existsUnsolved, existsSolved)
            this.setState({ existsUnsolved: existsUnsolved })
            this.setState({ existsSolved: existsSolved })

            let hasUnsolved = item.__info.unsolved;
            let hasSolved = item.__info.solved;
            this.setState({ hasUnsolved: hasUnsolved }); 
            this.setState({ hasSolved: hasSolved });
        };
    }

    toggleExpand = ev => this.setState({ expand: !this.state.expand })

    handleCopy = ev => {
        ev.stopPropagation();
        let info = this.props.item.__info;
        let cWeek = this.props.week;

        this.props.copy(info.rel)
        .then( () => {
            this.props.initialize(cWeek);
        })
        .catch(err => console.error(err) );
    }

    handleRemove = ev => {
        ev.stopPropagation();
        let info = this.props.item.__info;
        let cWeek = this.props.week;

        this.props.remove(info.rel)
        .then( () => {
            this.props.initialize(cWeek);
        })
        .catch(err => console.error(err) );
    }

    handleDirClick = ev => {
        ev.stopPropagation();
        this.toggleExpand();
    }
    

    handleFileClick = ev => {
        ev.stopPropagation();
        let relPath = this.props.item.__info.rel;
        this.props.open(relPath);
    }

    render() {
        const { existsSolved, existsUnsolved, hasUnsolved, hasSolved } = this.state;
        const file = this.props.item;
        const numFile = Object.keys(file).length;
        const info = file.__info;
        const isDir = file.__info.type === "dir";
        
        const isPushed = this.props.match ? this.props.match(info.rel) : null;
        return (
            
            <li onClick={this.handleDirClick} onDoubleClick={this.handleFileClick}
            styleName={`
                ${this.state.expand && this.props.clevel === 1 ? "bordered" : ""}
                item ${this.state.expand ? "expand" : ""}
                clevel-${this.props.clevel}
                ${isPushed ? "pushed" : ""}`
            }>
                <div styleName="item-content">
                    <FileType ext={info.ext} 
                    type={info.type} 
                    ispushed={this.state.isPushed ? "true" : "false"}
                    expand={this.state.expand ? "true" : "false"}/> 

                    <span styleName="item-name">{info.name}</span>
        
                    <Option rel={info.rel} 
                    role={this.props.role}
                    clevel={this.props.clevel}
                    existsSolved={existsSolved ? "true" : undefined}
                    existsUnSolved={existsUnsolved ? "true" : undefined}
                    hasSolved={hasSolved ? "true" : undefined}
                    hasUnsolved={hasUnsolved ? "true" : undefined}
                    handleCopy={this.handleCopy}
                    ispushed={this.state.isPushed ? "true" : undefined} 
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