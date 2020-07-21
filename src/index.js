import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import Account from './pages/Account'
import Asset from './pages/Asset'
import TransactionAlgo from './pages/TransactionAlgo'
import TransactionASA from './pages/TransactionASA'
import Orders from './pages/Orders'

class MainRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={'/'} component={App} />
          <Route exact path={'/account'} component={Account} />
          <Route exact path={'/asset'} component={Asset} />
          <Route exact path={'/transaction-algo'} component={TransactionAlgo} />
          <Route exact path={'/transaction-asa'} component={TransactionASA} />
          <Route exact path={'/orders'} component={Orders} />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <MainRouter/>,
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
