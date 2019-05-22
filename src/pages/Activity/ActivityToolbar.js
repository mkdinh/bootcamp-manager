import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './ActivityToolbar.css';

@CSSModules(styles)
class ActivityToolbar extends Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}

export { ActivityToolbar };
