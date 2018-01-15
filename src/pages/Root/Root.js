import React, { Component } from "react";
import Explorer, { Panel } from "../../components/Explorer";
import initializer from "../../utils/functions/initializer";
import { connect } from "react-redux";
const mapStateToProps = state =>
    ({
        aInstructor: state.instructor.activities,
        aStudent: state.student.activities,
    })

@connect(mapStateToProps)

class Root extends Component { 
    state = {
        instructor: {},
        student: {},
        initialized: false
    }

    componentDidMount() {
        console.log("root")
        this.initialize();
    }

    componentWillReceiveProps(props) {
        this.initialize();
    }

    initialize = () => {
        let instructorPath ={  ...this.props.aInstructor };
        let studentPath = { ...this.props.aStudent };
        instructorPath.params = studentPath.params = [":root"];
        initializer.initialize(null, studentPath)
        .then(dirs => this.setState({ ...dirs, initialized: true }))
        .catch(err => console.log(err));   
    };

    render() {
        const { instructor, student, initialized } = this.state;
        return (
           initialized ? 
                <Explorer>
                    <Panel
                    data={instructor}
                    width={40}
                    role="instructor"
                    nestedlevel={3} 
                    page="activities"
                    background="#292929"
                    copy={initializer.copy}
                    initialize={this.initialize}/>

                    <Panel directory
                    data={student}
                    nestedlevel={6} 
                    role="student"
                    page="activities"
                    width={60}
                    remove={initializer.remove}
                    initialize={this.initialize}/>
                </Explorer>
            : null
        )
    }
};

export { Root };
