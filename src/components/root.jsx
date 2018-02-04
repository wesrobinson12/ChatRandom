import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { browserHistory } from 'react-router';
import App from './app';
import LoginPage from './Login/LoginPage';


const Root = ({store}) => (
  <Provider store={ store }>
    <BrowserRouter history={ browserHistory }>
      <App />
    </BrowserRouter>
  </Provider>
);


export default Root;
