// import react
//--------------------------------------------------------
import React, { Component } from "react";
import electron from "electron";
import Form from "./Form";
import Text from "./Text";
import Field from "./Field";
import DirButton from "../Button/DirectorySubmit";
import actions from "../../utils/actions";
import { connect } from "react-redux";

const { dialog } = electron.remote;

const mapStateToProps = state => {
    return ({
        instructor: state.instructor,
        student: state.student
    })
}

@connect(mapStateToProps)

export default class DirectoryForm extends Component {

    shouldComponentUpdate(nProps, nState) {
        // only updte if there is a new directory
        let role = this.props.role;
        let tDir = this.props.path;
        let cDir = this.props[role][tDir];
        let nDir = nProps[role][tDir];
        if(cDir === nDir) {
            return false;
        }else {
            return true;
        };
    }

    handleClick= ev => {
        ev.preventDefault();
        let param = this.props.param;
        let rolePath = this.props[this.props.role];
        let root = rolePath.root;

        dialog.showOpenDialog({
            defaultPath: root,
            properties: ["openDirectory","openFile"]
            }, data => {              
             // update directory to json and redux storage
             // use relative if not root
            let path = data[0];
            if(path) {
                // if the path is for the root, save the relative path
                if(param !== "root") {
                    path = path.replace(root, "");
                };
    
                this.props.dispatch(actions[this.props.role].updateDir(param , path))
                .catch( err => console.log(err) );
            };
        });
    }

    render() {
        const dir = this.props[this.props.role] || {};
        const value = dir[this.props.param] || "";

        return (
            <Form>
                <Field inline>
                    <Text readOnly
                    value={value} 
                    label={this.props.label}/>
                    <DirButton 
                    onClick={this.handleClick} 
                    content="Find"/>
                </Field>
            </Form>
        )
    }
};
