import React, { Component } from "react";
import Explorer, { Panel } from "../../components/Explorer";
import initializer from "../../utils/functions/initializer";
import { connect } from "react-redux";
const mapStateToProps = state =>
    ({
        pInstructor: state.instructor.projects,
        pStudent: state.student.projects,
        cWeek: state.weeks.current
    })

@connect(mapStateToProps)

class Project extends Component { 
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
        let instructorPath = this.props.pInstructor;
        let studentPath = this.props.pStudent;
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
                    page="projects"
                    path={this.props.cWeek.week}
                    week={this.props.cWeek}
                    background="#292929"
                    open={initializer.openFile}
                    copy={initializer.copy}
                    initialize={this.initialize}/>

                    <Panel directory
                    data={student}
                    nestedlevel={5} 
                    role="student"
                    page="projects"
                    path={this.props.cWeek.subject}
                    week={this.props.cWeek}
                    width={60}
                    open={initializer.openFile}
                    remove={initializer.remove}
                    initialize={this.initialize}/>
                </Explorer>
            : null
        )
    }
};

export { Project };
