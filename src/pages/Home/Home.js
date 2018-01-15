import React, { Component } from "react";
import Explorer from "../../components/Explorer";
import CSSModules from "react-css-modules";
import styles from "./Home.css";
import { connect } from "react-redux";
import { Panel } from "../../components/Explorer/Panel/Panel";
import { Header } from "../../components/Text";

const mapStateToProps = state => {
    return ({
        activities: state.home.activities,
        timeTracker: state.home.timeTracker,
        cWeek: state.weeks.current
    })
}

@connect(mapStateToProps)
@CSSModules(styles)

export class Home extends Component { 
    state = {}
    
    render() {  
        return (
            <Explorer header="">
                <Header 
                size="2.5rem"
                margin="1rem"
                content="Bootcamp Manager" />

                <Panel directory
                data={this.props.activities}
                width={40}
                role="instructor"
                nestedlevel={1} 
                page="activity"
                header="Today Activities"
                path={this.props.cWeek.week}
                week={this.props.cWeek}
                background="#292929"/>
            </Explorer>
        )
    };
};
