import React, { Component } from "react"
import CSSModules from "react-css-modules";
import styles from "./Navbar.css";

const NavItem = (props) =>
    <li styleName={props.active ? "navbar-item-active" : "navbar-item"} {...props}>
        {props.content} 
    </li>


export default CSSModules(NavItem, styles);