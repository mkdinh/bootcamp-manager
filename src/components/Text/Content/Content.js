import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Item from '../Item';
import { connect } from 'react-redux';
import actions from '../../../utils/actions';
import CSSModules from 'react-css-modules';
import styles from './Content.css';

const mapStateToProps = state => {
  return {
    cSection: state.home.cSection,
  };
};

const options = {
  allowMultiple: true,
  handleNotFoundStyleName: 'ignore',
};

@connect(mapStateToProps)
@CSSModules(styles, options)
class Content extends Component {
  state = {
    sections: [],
    scrolling: false,
  };

  componentDidMount() {
    // manipulate scroll top positions
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('keydown', this.handleKeyPress);

    if (this.props.cSection) {
      this.content.scrollTop = this.props.cSection.offset;
    } else {
      this.props.dispatch(actions.home.cSection({ index: 0, offset: 0 }));
    }

    this.content.childNodes.forEach(child => {
      if (child.className.match('three')) {
        this.bookmark(child.offSetTop);
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = ev => {
    switch (ev.which) {
      case 37:
        let prevIndex = this.props.cSection.index - 1;
        let prevSection = this.state.sections[prevIndex];
        this.content.scrollTop = prevSection.offset;
        this.props.dispatch(actions.home.cSection(prevSection));
        break;

      case 39:
        let nextIndex = this.props.cSection.index + 1;
        let nextSection = this.state.sections[nextIndex];
        this.content.scrollTop = nextSection.offset;
        this.props.dispatch(actions.home.cSection(nextSection));
        break;
    }
  };

  handleScrollEnd = offset => {
    let sections = [];
    let cSection = {};
    let nIndex = 0;
    this.state.sections.forEach(el => {
      sections[el.index] = {
        index: el.index,
        offset: Math.abs(el.offset - offset),
      };
    });
    sections = sections.sort((a, b) => a.offset - b.offset);
    nIndex = sections[0].index;
    cSection = this.state.sections[nIndex];
    this.props.dispatch(actions.home.cSection(cSection));
  };

  _timeout = null;

  handleScroll = ev => {
    console.log('scrolling');
    if (this._timeout) {
      // clear if there already a timeout
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(() => {
      this._timeout = null;
      this.setState({ scrolling: false });
      this.handleScrollEnd(ev.target.scrollTop);
    }, 20);

    if (!this.state.scrolling) {
      this.setState({ scrolling: true });
    }
  };

  handleClick = ev => {
    let offset = ev.currentTarget.getAttribute('offset');
    let index = ev.currentTarget.getAttribute('index');
    offset = parseFloat(offset);
    index = parseFloat(index);
    let cSection = {
      offset: offset,
      index: index,
    };
    this.content.scrollTop = offset;
    this.props.dispatch(actions.home.cSection(cSection));
  };

  bookmark = () => {
    let sections = [];
    this.content.childNodes.forEach(child => {
      if (child.className.match('three')) {
        let offset = child.offsetTop;
        let mark = {
          index: sections.length,
          offset: offset,
        };
        sections.push(mark);
      }
    });
    this.setState({ sections: sections });
  };

  render() {
    const cSection = this.props.cSection;

    return (
      <div ref={node => (this.wrapper = node)} styleName="content-wrapper">
        <div styleName="content-bookmark">
          {this.state.sections.map(el => (
            <button
              styleName={`content-bookmark-item 
                        ${cSection.index === el.index ? 'active' : ''}`}
              onClick={this.handleClick}
              index={el.index}
              offset={el.offset}
              key={el.index}
            >
              {el.index}
            </button>
          ))}
        </div>

        <div styleName="content" ref={node => (this.content = node)}>
          {this.props.content &&
            this.props.content.map(item => (
              <Item
                key={Math.random()}
                content={item}
                bookmark={this.bookmark}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default Content;
