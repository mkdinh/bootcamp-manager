import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./Navbar.css";
import NavItem from "./NavbarItem";
import { ExitButton } from "../Button/ExitButton";
import WeekSelector from "./WeekSelector";
import { withRouter } from "react-router";

@CSSModules(styles)

class Navbar extends Component {
    state = {
        active: "home"
    }

    componentDidMount() {
        this.props.history.replace(this.state.active);
    }

    handleClick = ev => {
        // grab tab content and link
        let active = ev.target.getAttribute("content");
        let page = ev.target.getAttribute("to");
        this.setState({ active: active });
        this.props.history.replace(page);
    }
    
    render() {
        const active = this.state.active;
        const cWeek = this.props.cWeek || "01";
        
        return (
            <ul styleName="navbar">
                <NavItem 
                to="/home" 
                active={active === "home" ? "true" : undefined} 
                onClick={this.handleClick} 
                content="home"/>

                <NavItem 
                to={`/activities/${cWeek.subject}`} 
                active={active === "activities" ? "true" : undefined} 
                onClick={this.handleClick} 
                content="activities"/>
                
                <NavItem 
                to={`/homeworks/${cWeek.subject}`} 
                active={active === "homeworks" ? "true" : undefined} 
                onClick={this.handleClick} 
                content="homeworks"/>
                <NavItem 
                to={`/slides/${cWeek.subject}`} 
                active={active === "slides" ? "true" : undefined} 
                onClick={this.handleClick} 
                content="slides"/>

                <NavItem 
                to={`/projects/${cWeek.subject}`} 
                active={active === "projects" ? "true" : undefined} 
                onClick={this.handleClick} 
                content="projects"/>

                <NavItem 
                to={`/root`} 
                active={active === "root" ? "true" : undefined} 
                onClick={this.handleClick} 
                content="root"/>

                <WeekSelector/>

                <ExitButton/>
            </ul>
        )
    }
};

export default withRouter(Navbar);