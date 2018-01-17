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
        aInstructor: state.instructor.activities,
        aStudent: state.student.activities
    })
}

@connect(mapStateToProps)
@CSSModules(styles)

export class Home extends Component { 
    state = {
        student: {nested: []},
        initialized: false
    }

    componentDidMount() {
        this.initialize(this.props.cWeek);
    }

    componentWillReceiveProps(props) {
        this.initialize(props.cWeek);
    }

    initialize = cWeek => {
        let instructorPath = this.props.aInstructor;
        let studentPath = this.props.aStudent;
        initializer.initialize(instructorPath, studentPath, cWeek.subject, cWeek.subject)
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
                    copy={initializer.copy}
                    match={initializer.match}
                    initialize={this.initialize}/>

                </Explorer>
            :
                null
        )
    };
};
