import React from "react";
import actions from "./utils/actions";
import { connect } from "react-redux";

export default Component => {

    const mapStateToProps = state => 
        ({
            cWeek: state.weeks.current,
            instructor: state.instructor
        })

    @connect(mapStateToProps)

    class InitHOC extends Component {

        state = {
            initialized: false
        }

        componentDidMount() {
            // init with config file
            this.props.dispatch(actions.init())
            .then(result => {
                this.setState({ initialized: true })
            })
        }

        render() {
            const initialized = this.state.initialized;
            
            return (
                initialized ? 
                    <Component {...this.props}/> : null
            )
        }
    };

    return InitHOC;
}