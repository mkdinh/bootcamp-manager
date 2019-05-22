import React, { Component } from 'react';
import InitHOC from './InitHOC';
import { MemoryRouter as Router, Switch, Route } from 'react-router';
import { Home, Activity, Homework, Project, SlideShow, Root } from './pages';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import CSSModules from 'react-css-modules';
import './App.css';

const style = {
  container: {
    width: '100vw',
    height: '100vh',
    background: '#303030',
    display: 'flex',
    flexDirection: 'column',
  },
};

class App extends Component {
  render() {
    return (
      <Router>
        <div style={style.container}>
          <Navbar cWeek={this.props.cWeek} />
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path={'/activities/:week'} component={Activity} />
            <Route exact path={'/projects/:week'} component={Project} />
            <Route exact path={'/homeworks/:week'} component={Homework} />
            <Route exact path={'/slides/:week'} component={SlideShow} />
            <Route exact path={'/root/'} component={Root} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default InitHOC(App);
