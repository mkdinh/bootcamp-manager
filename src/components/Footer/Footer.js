import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./Footer.css";
import Fa from "react-fontawesome";
import fileManager from "../../utils/functions/fileManager";

const options = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
}

@CSSModules(styles, options)

export default class Footer extends Component {

    state = {
        message: "",
        error: false,
        loading: false,
        disabled: true
    }

    toggleLoading = () => this.setState({ loading: !this.state.loading })

    handlePush = ev => {
        ev.preventDefault();
        if(this.state.message && !this.state.error) {
            this.toggleLoading();
            fileManager.gitPush(this.state.message)
            .then( result => {
                this.toggleLoading();
                console.log(result);
            })
            .catch( err => { 
                this.setState({ message: err.message, error: true })
                console.error(err) 
            });
        } else {
            this.setState({ error: true, message: "a commit message is required" })
        }
    }

    handleChange = ev => {
        const { name, value } = ev.target;
        this.setState({ [name]: value }, () => {
            if(this.state.message) {
                this.setState({ disabled: false })
            }else if(!this.state.message && !this.state.disabled) {
                this.setState( { disabled: true })
            }
        });
    }

    handleFocus = ev => {
        if(this.state.error) {
            this.setState({ error: false, message: "" })
        }
    }

    render() {

        const { disabled, error, loading } = this.state;

        return (
            <div styleName="footer">
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

                    {/* button is disabled when loading or when message is empty */}
                    <button 
                    disabled={this.state.disabled}
                    styleName={`footer-button-push ${disabled || loading ? "disabled" : "enabled"}`} 
                    onClick={this.handlePush}>
                        <span styleName="footer-button-content">
                            {this.state.loading ? 
                                <Fa name="circle-o-notch" spin/>
                            :
                                "Push"}
                        </span>
                    </button>
            </div>
        )
    }
}