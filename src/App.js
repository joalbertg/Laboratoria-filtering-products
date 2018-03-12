import React, { Component } from 'react';
// El componente Provider que expone `react-redux`
import { Provider } from 'react-redux';

import Main from './lib/Main'
// El que acabamos de crear
import store from './lib/store';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

export default App;
