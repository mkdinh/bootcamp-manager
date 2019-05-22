import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import styles from './ActivityOptions.css';
import Fa from 'react-fontawesome';

const mapStateToProps = state => {
  return {
    cDay: state.weeks.day,
    cWeek: state.weeks.current,
  };
};

@connect(mapStateToProps)
@CSSModules(styles)
class ActivityOptions extends Component {
  state = {
    expand: false,
    options: [
      {
        text: 'Unsolved',
        method: this.copyUnsolved,
        styleName: 'opt-copy-unsolved',
      },
      {
        text: 'Solved',
        method: this.copySolved,
        styleName: 'opt-copy-solved',
      },
    ],
  };

  copyUnsolved = () => {};

  copySolved = () => {};

  toggleExpand = () => this.setState({ expand: !this.state.expand });

  render() {
    return (
      <div styleName="activity-options">
        <ul styleName="options">
          <li styleName="option-item">
            <div styleName="opt-label"> Copy: </div>{' '}
          </li>
          {this.state.options.map(x => (
            <li key={x.text} styleName="option-item" onClick={x.method}>
              <div styleName={x.styleName}>{x.text}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export { ActivityOptions };
