import React, { Component } from "react";
import Explorer, { Panel } from "../../components/Explorer";
import initializer from "../../utils/functions/initializer";
import { connect } from "react-redux";
const mapStateToProps = state =>
    ({
        cWeek: state.weeks.current,
        roots: state.directories.roots
    })

@connect(mapStateToProps)

class Root extends Component { 
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
        let { roots, cWeek } = this.props;
        initializer.initialize(roots, null, cWeek)
        .then(dirs => this.setState({ ...dirs, initialized: true }))
        .catch(err => console.log(err));   
    };

    render() {
        const { instructor, student, initialized } = this.state;
        return (
           initialized ? 
                <Explorer>
                    <Panel 
                    width={40}
                    role="instructor"
                    nestedlevel={3} 
                    header={"Root"}
                    page="root"
                    background="#292929">
                    
                    </Panel>
                    
                    <Panel directory
                    data={student}
                    nestedlevel={6} 
                    role="student"
                    page="activities"
                    width={60}
                    exists={initializer.exists}
                    remove={initializer.remove}
                    open={initializer.openFile}
                    initialize={this.initialize}/>
                </Explorer>
            : null
        )
    }
};

export { Root };
