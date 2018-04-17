import React, { Component } from "react";
import reactDOM from "react-dom";
import CSSModules from "react-css-modules";
import weeks from "./weeks.json";
import { connect } from "react-redux";
import actions from "../../../utils/actions";
import styles from "./WeekSelector.css";

const mapStateToProps = (state) => {
    return ({
        cWeek: state.weeks.current
    });
};

@connect(mapStateToProps)
@CSSModules(styles)

export default class WeekSelector extends Component {
    state = { expand: false }

    componentDidMount() {
        
    }

    toggleExpand = () => this.setState({ expand: !this.state.expand })

    handleClick = ev => {
        let week = ev.target.getAttribute("data-week");
        let subject = ev.target.getAttribute("data-subject");
        let cWeek = {
            week: week,
            subject: subject
        };
        
        this.props.dispatch(actions.weeks.updateCurrent(cWeek))
        .then( () => {
            this.toggleExpand();
            this.props.dispatch(actions.init(cWeek));
        })
        .catch( err => console.log(err) );
    }

    render() {

        const cWeek = this.props.cWeek || {};

        return (
            <div ref={node => this.select = node} styleName="week-select">
                <div styleName="week-active" onClick={this.toggleExpand}>
                    {cWeek.subject}
                </div>

                {this.state.expand ? 
                    <ul styleName="week-expand">
                        {weeks.map(item => 
                            <li 
                            key={item.subject} 
                            styleName="week-option" 
                            onClick={this.handleClick}
                            data-subject={item.subject}
                            data-week={item.week}>
                                {item.content}
                            </li>
                        )}
                    </ul> : null}
            </div>
        )
    }
};
