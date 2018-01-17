import React, { Component } from "react";
import Explorer, { Panel } from "../../components/Explorer";
import initializer from "../../utils/functions/initializer";
import { connect } from "react-redux";
const mapStateToProps = state =>
    ({
        aInstructor: state.instructor.activities,
        aStudent: state.student.activities,
        cWeek: state.weeks.current
    })

@connect(mapStateToProps)

class Activity extends Component { 
    state = {
        instructor: {},
        student: {},
        initialized: false
    }

    componentDidMount() {
        this.initialize(this.props.cWeek);
    }

    componentWillReceiveProps(props) {
        if(this.state.initialized) this.initialize(props.cWeek);
    }

    initialize = cWeek => {
        let instructorPath = this.props.aInstructor;
        let studentPath = this.props.aStudent;
        initializer.initialize(instructorPath, studentPath, cWeek.subject, cWeek.subject)
        .then(dirs => this.setState({ ...dirs, initialized: true }))
        .catch(err => console.log(err));   
    };

    render() {
        const { instructor, student, initialized } = this.state;
        
        return (
           initialized ? 
                <Explorer>
                    <Panel directory
                    data={instructor}
                    width={40}
                    role="instructor"
                    nestedlevel={5} 
                    page="activities"
                    path={this.props.cWeek.week}
                    week={this.props.cWeek}
                    background="#292929"
                    copy={initializer.copy}
                    match={initializer.match}
                    initialize={this.initialize}/>

                    <Panel directory
                    data={student}
                    nestedlevel={5} 
                    role="student"
                    page="activities"
                    path={this.props.cWeek.subject}
                    week={this.props.cWeek}
                    width={60}
                    remove={initializer.remove}
                    match={initializer.match}
                    initialize={this.initialize}/>
                </Explorer>
            : null
        )
    }
};

export { Activity };
