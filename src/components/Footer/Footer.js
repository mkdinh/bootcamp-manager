import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./Footer.css";
import Fa from "react-fontawesome";
import { GitStatus } from "../Popup"
import git from "../../utils/functions/git_manager";

const options = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
}

@CSSModules(styles, options)

export default class Footer extends Component {

    state = {
        message: "",
        status: null,
        error: false,
        loading: false,
        disabled: true
    };

    componentDidMount() {
        git.init()
        .then( result => {
            // only display popup if there are files changes
            if (result.files.length > 0) {
                this.setState({ status: result });
            };
        })
        .catch( err => console.log(err));

    };

    toggleLoading = () => this.setState({ loading: !this.state.loading });

    handleCancel = () => this.setState({ status: null });

    handleConfirm = ev => {
        ev.preventDefault();
        if(this.state.message && !this.state.error) {
            this.toggleLoading();
            git.status()
            .then( result => {
                this.toggleLoading();
                this.setState({ status: result });
            })
            .catch( err => { 
                this.setState({ message: err.message, error: true })
                console.error(err) 
            });
        } else {
            this.setState({ error: true, message: "a commit message is required" })
        }
    };

    handlePush = ev => {
        ev.preventDefault();
        alert("confirmed!")
        if(this.state.message && !this.state.error) {
            this.toggleLoading();
            git.push(this.state.message)
            .then( result => {
                this.setState({ message: "", status: null });
                this.toggleLoading();
            })
            .catch( err => { 
                this.setState({ message: err.message, error: true })
                console.error(err) 
            });
        } else {
            this.setState({ error: true, message: "a commit message is required" })
        }
    };

    handleChange = ev => {
        const { name, value } = ev.target;
        this.setState({ [name]: value }, () => {
            if(this.state.message) {
                this.setState({ disabled: false })
            }else if(!this.state.message && !this.state.disabled) {
                this.setState( { disabled: true })
            }
        });
    };

    handleFocus = ev => {
        if(this.state.error) {
            this.setState({ error: false, message: "" })
        }
    };

    render() {

        const { disabled, error, loading, status } = this.state;

        return (
            <div styleName="footer">
                {/* display repo status on first click */}
                {this.state.status ? <GitStatus status={status}/> : null}
                {/* 
                    append error into message box if push with an empty message 
                    error message is remove and error === when focus on input
                */}
                <input 
                name="message"
                ref={node => this.input = node}
                placeholder="commit message (require)"
                styleName={`footer-input-message ${error ? "error" : ""}`}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                value={this.state.message}/>


                {/* button appear only when push */}
                {this.state.status ? 
                    <button 
                    styleName={`footer-button cancel ${disabled || loading ? "disabled" : "enabled"}`} 
                    onClick={this.handleCancel}>
                        <span styleName="footer-button-content">
                            {this.state.loading ? 
                                <Fa name="circle-o-notch" spin/>
                            :
                                "Cancel"}
                        </span>
                    </button> : null}

                {/* button is disabled when loading or when message is empty */}
                <button 
                disabled={this.state.disabled}
                styleName={`footer-button push ${disabled || loading ? "disabled" : "enabled"}`} 
                onClick={this.state.status ? this.handlePush : this.handleConfirm}>
                    <span styleName="footer-button-content">
                        {this.state.loading ? 
                            <Fa name="circle-o-notch" spin/>
                        :
                        this.state.status ?
                            "Confirm"
                        :
                            "Push"}
                    </span>
                </button>
            </div>
        );
    };
}