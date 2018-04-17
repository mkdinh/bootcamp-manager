import React, { Component } from "react";
import Explorer, { Panel } from "../../components/Explorer";
import initializer from "../../utils/functions/initializer";
import { connect } from "react-redux";
const mapStateToProps = state =>
    ({
        cWeek: state.weeks.current,
        roots: state.directories.roots,
        activities: state.directories.activities
    })

@connect(mapStateToProps)

class Activity extends Component { 
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
        let { roots, activities, cWeek } = this.props;
        initializer.initialize(roots, activities, cWeek)
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
                    open={initializer.openFile}
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
                    open={initializer.openFile}
                    remove={initializer.remove}
                    match={initializer.match}
                    exists={initializer.exists}
                    initialize={this.initialize}/>
                </Explorer>
            : null
        )
    }
};

export { Activity };
