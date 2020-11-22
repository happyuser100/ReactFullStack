import React, { Component } from "react";
import FleetList from "./components/fleet-list";
import "./App.css"
// import '@progress/kendo-theme-default/dist/all.css';
import '@progress/kendo-theme-bootstrap/dist/all.css';

export default class App extends Component {

  render() {
    return (
        <React.Fragment>
          <div className="vessels-app">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <FleetList />
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
    );
  }
}
