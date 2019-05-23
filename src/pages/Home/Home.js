import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import Explorer from '../../components/Explorer';
import CSSModules from 'react-css-modules';
import styles from './Home.css';
import { connect } from 'react-redux';
import { Panel } from '../../components/Explorer/Panel/Panel';
import { Header, Content } from '../../components/Text';
import initializer from '../../utils/functions/initializer';
import fileService from '../../services/FileService';

const mapStateToProps = state => {
  return {
    today_activities: state.home.today_activities,
    timesheet: state.home.timesheet,
    overview: state.home.overview,
    cWeek: state.weeks.current,
    roots: state.directories.roots,
    activities: state.directories.activities,
  };
};

@connect(mapStateToProps)
@CSSModules(styles)
export class Home extends Component {
  state = {
    instructor: false,
    student: false,
    initialized: false,
  };

  componentDidMount() {
    this.initialize();
  }

  componentWillReceiveProps(props) {
    if (this.state.initialized) {
      setTimeout(() => this.initialize(), 0);
    }
  }

  initialize = () => {
    let { roots, activities, cWeek } = this.props;
    initializer
      .initialize(roots, activities, cWeek)
      .then(dirs => {
        this.setState({ ...dirs, initialized: true });
      })
      .catch(err => console.log(err));
  };

  trasnformImageUri = uri => {
    const path = fileService.getPathToDailyImage(uri);
    return `file:///${path}`;
  };

  linkRenderer = props => {
    const filePath = fileService.getPathToDailyFile(props.href);
    return <a href="#">{props.children}</a>;
  };

  render() {
    const { initialized } = this.state;
    const { timesheet } = this.props;
    // console.log(this.props.cWeek.subject)
    return initialized ? (
      <Explorer header="">
        <Panel width={60}>
          <Header size="2rem" margin="0.5rem" content="Bootcamp Manager" />
          <div styleName="summary-wrapper">
            <ReactMarkdown
              source={this.props.overview}
              transformImageUri={this.trasnformImageUri}
              renderers={{ link: this.linkRenderer }}
            />
          </div>
        </Panel>
        <Panel width={40} header="Timesheet" background="#292929">
          <table>
            <thead>
              {timesheet.header.map(h => {
                return h !== 'Priority' && <th key={h}> {h} </th>;
              })}
            </thead>

            <tbody>
              {timesheet.activities.map(r => {
                return (
                  <tr>
                    {r.map(d => {
                      return <td>{d}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
        />
      </Explorer>
    ) : null;
  }
}
