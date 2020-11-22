import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import App from './App';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FleetList from "./components/fleet-list";
import VesselList from "./components/vessel-list";

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <Router>
    <Switch>
          <Route exact path="/" component={App} />
          <Route path="/fleets" component={FleetList} />
          <Route path="/vessels/:id" component={VesselList} />
        </Switch>
      </Router>

  </React.StrictMode>,
  document.getElementById('root')
);
