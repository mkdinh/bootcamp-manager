import React, { Component } from "react";
import Explorer, { Panel } from "../../components/Explorer";
import initializer from "../../utils/functions/initializer";
import { connect } from "react-redux";
const mapStateToProps = state =>
    ({
        cWeek: state.weeks.current,
        roots: state.directories.roots,
        projects: state.directories.projects
    })

@connect(mapStateToProps)

class Project extends Component { 
    state = {
        instructor: {},
        student: {},
        initialized: false
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillReceiveProps(props) {
        if(this.state.initialized) {
            setTimeout(() => this.initialize(), 0);
        };
    }

    initialize = () => {
        let { roots, projects, cWeek } = this.props;
        initializer.initialize(roots, projects, cWeek)
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
                    exists={initializer.exists}
                    initialize={this.initialize}/>
                </Explorer>
            : null
        )
    }
};

export { Project };
