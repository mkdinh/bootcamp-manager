import React, { Component } from "react";
import Explorer, { Panel } from "../../components/Explorer";
import initializer from "../../utils/functions/initializer";
import { connect } from "react-redux";
const mapStateToProps = state =>
    ({
        hInstructor: state.instructor.homework,
        hStudent: state.student.homework,
        cWeek: state.weeks.current
    })

@connect(mapStateToProps)

class Homework extends Component { 
    state = {
        instructor: {},
        student: {},
        initialized: false
    }

    componentDidMount() {
        this.initialize(this.props.cWeek);
    }

    componentWillReceiveProps(props) {
        this.initialize(props.cWeek);
    }

    initialize = cWeek => {
        let instructorPath = this.props.hInstructor;
        let studentPath = this.props.hStudent;
        initializer.initialize(instructorPath, studentPath, cWeek.subject, cWeek.subject)
        .then(dirs => this.setState({ ...dirs, initialized: true }))
        .catch(err => console.log(err));   
    }

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
                    page="homework"
                    path={this.props.cWeek.week}
                    week={this.props.cWeek}
                    background="#292929"
                    copy={initializer.copy}
                    initialize={this.initialize}/>

                    <Panel 
                    data={student} directory
                    nestedlevel={5} 
                    role="student"
                    page="homework"
                    path={this.props.cWeek.subject}
                    week={this.props.cWeek}
                    width={60}
                    remove={initializer.remove}
                    initialize={this.initialize}/>
                </Explorer>
            : null
        )
    }
};

export { Homework };
