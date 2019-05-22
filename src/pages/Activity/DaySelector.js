import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import styles from './DaySelector.css';

const mapStateToProps = state => {
  return {
    cDay: state.weeks.day,
    cWeek: state.weeks.current,
  };
};

@connect(mapStateToProps)
@CSSModules(styles)
class DaySelector extends Component {
  state = {
    currentDay: { value: 0, text: '' },
    options: [
      {
        value: 1,
        text: 'Day 01',
      },
      {
        value: 2,
        text: 'Day 02',
      },
      {
        value: 3,
        text: 'Day 03',
      },
    ],
    expand: false,
  };

  componentWillMount() {
    const currentDay = this.state.options.find(
      x => x.value === this.props.cDay,
    );
    this.setState({ currentDay });
  }

  toggleExpand = () => this.setState({ expand: !this.state.expand });

  handleClick = ev => {
    const index = ev.target.getAttribute('data-index');
    const currentDay = this.state.options[index];
    this.setState({ currentDay }, this.toggleExpand);
    this.props.onSelect(currentDay);
  };

  render() {
    const { options } = this.state;

    return (
      <div ref={node => (this.select = node)} styleName="day-select">
        <div styleName="day-active" onClick={this.toggleExpand}>
          {this.state.currentDay.text}
        </div>

        {this.state.expand ? (
          <ul styleName="day-expand">
            {options.map((item, index) => (
              <li
                key={item.value}
                styleName="day-option"
                onClick={this.handleClick}
                data-index={index}
              >
                {item.text}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }
}

export { DaySelector };
