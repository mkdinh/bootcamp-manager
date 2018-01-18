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
        hasSolved: false,
        hasUnSolved: false
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
            // grab rel paths and check against student
            let unsolvedFolder = props.item["Unsolved"];
            let solvedFolder = props.item["Solved"];
            if(unsolvedFolder) {
                this.setState({ hasUnsolved: true }); 
            } else {
                this.setState( { hasUnsolved: false })
            }
            if(solvedFolder) {
                this.setState({ hasSolved: true });
            } else {
                this.setState({ hasSolved: false })
            }
        };
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
        .then( () => {
            console.log("remove and reinit")
            this.props.initialize(cWeek) 
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
        const { hasUnsolved, hasSolved } = this.state;
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