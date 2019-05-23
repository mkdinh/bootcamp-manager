import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import styles from './ActivityOptions.css';

const mapStateToProps = state => {
  return {
    activities: state.activities,
    cDay: state.weeks.day,
    cWeek: state.weeks.current,
  };
};

@connect(mapStateToProps)
@CSSModules(styles)
class ActivityOptions extends Component {
  state = {
    expand: false,
  };

  get options() {
    return [
      {
        text: 'Copy: ',
        styleName: 'opt-label',
      },
      {
        text: 'Unsolved',
        method: this.props.onCopyUnsolved,
        styleName: 'opt-copy-unsolved',
      },
      {
        text: 'Solved',
        method: this.props.onCopySolved,
        styleName: 'opt-copy-solved',
      },
    ];
  }

  toggleExpand = () => this.setState({ expand: !this.state.expand });

  render() {
    return (
      <div styleName="activity-options">
        <ul styleName="options">
          <li styleName="option-item" />
          {this.options.map(x => (
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
