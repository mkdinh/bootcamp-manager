import React, { Component } from "react";
import Explorer from "../../components/Explorer";
import CSSModules from "react-css-modules";
import styles from "./Home.css";
import { connect } from "react-redux";
import { Panel } from "../../components/Explorer/Panel/Panel";
import { Header, Content } from "../../components/Text";
import initialize from "../../utils/functions/initializer";
import initializer from "../../utils/functions/initializer";

const mapStateToProps = state => {
    return ({
        today_activities: state.home.today_activities,
        overview: state.home.overview,
        cWeek: state.weeks.current,
        roots: state.directories.roots,
        activities: state.directories.activities
    })
}

@connect(mapStateToProps)
@CSSModules(styles)

export class Home extends Component { 
    state = {
        instructor: false,
        student: false,
        initialized: false
    }

    componentDidMount() {
        this.initialize();
    };

    componentWillReceiveProps(props) {
        if(this.state.initialized) {
            setTimeout(() => this.initialize(), 0);
        };
    }

    initialize = () => {
        let { roots, activities, cWeek } = this.props;
        initializer.initialize(roots, activities, cWeek)
        .then(dirs => {
            this.setState({ ...dirs, initialized: true })
        })
        .catch(err => console.log(err));   
    };

    todayOnly = () => {
        let filtered = {};
        let todayActv = this.props.today_activities;
        let totalActv = Math.abs(todayActv[1] - todayActv[0]);
        let activities = this.state.instructor;
        for(let key in activities) {
            filtered[key] = {};
            if(key !== "relPaths") {
                for(let file in activities[key]) {
                    let num = parseInt( file.substring(0, 2) );
                    if(num >= todayActv[0] && num <= todayActv[1]) {
                        filtered[key][file] = activities[key][file];
                        if(num === todayActv[1]) return;
                    };
                };
            };
        };
        return filtered;
    }
    
    render() {  
        const { instructor, initialized } = this.state;
        // console.log(this.props.cWeek.subject)
        return (
            initialized ? 
                <Explorer header="">
                    <Panel width={60}>
                        <Header 
                        size="2rem"
                        margin="0.5rem"
                        content="Bootcamp Manager" />
                        <Content content={this.props.overview}/>
                    </Panel>

                    <Panel directory
                    data={this.todayOnly()}
                    width={40}
                    role="instructor"
                    nestedlevel={2} 
                    page="activity"
                    header="Today Activities"
                    path={this.props.cWeek.week}
                    week={this.props.cWeek}
                    background="#292929"
                    open={initialize.openFile}
                    copy={initializer.copy}
                    match={initializer.match}
                    initialize={this.initialize}/>

                </Explorer>
            :
                null
        )
    };
};
