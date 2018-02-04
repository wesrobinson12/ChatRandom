import LoginPage from './Login/LoginPage';
import Chat from './Chat/Chat';
import { Route, Switch } from 'react-router-dom';
import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';

const App = (props) => (
  <main className={props.classes.appContainer}>
    <header className={props.classes.header}>Chat Random</header>
    <img className={props.classes.chatBubble}
      src='../../assets/images/chat.png'>
    </img>
    <Switch>
      <Route exact path='/' component={LoginPage} />
      <Route path='/login' component={LoginPage} />
      <Route path='/chat' component={Chat} />
    </Switch>
  </main>
);

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Open Sans',
  },
  header: {
    marginTop: '30px',
    fontSize: '40px',
  },
  chatBubble: {
    textAlign: 'center',
    marginTop: '20px'
  }
};

export default injectSheet(styles)(App);
