import React, { Component } from 'react';
import List from '../List';
import CSSModules from 'react-css-modules';
import styles from './Panel.css';

const options = {
  allowMultiple: true,
};

let Panel = props => {
  const style = {
    background: props.background || 'transparent',
    width: props.width + '%',
  };
  const _props = props.data ? { ...props, data: props.data.nested } : null;

  return (
    <div style={style} styleName="panel">
      {props.header ? (
        typeof props.header === 'string' ? (
          <h1 styleName="panel-header">{props.header || props.role}</h1>
        ) : (
          <props.header />
        )
      ) : null}

      {props.directory ? (
        Object.keys(props.data.nested).length ? (
          <div styleName="panel-content">
            <List clevel={0} {..._props} />
          </div>
        ) : (
          <div styleName="panel-placeholder">{`No ${
            props.page
          } file currently`}</div>
        )
      ) : (
        props.children
      )}
    </div>
  );
};

Panel = CSSModules(Panel, styles, options);

export { Panel };
