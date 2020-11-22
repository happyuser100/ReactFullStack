import * as React from "react";
import { PureComponent } from "react";

export default class VesselInfo extends PureComponent {
  render() {
    const { info } = this.props;
    //const displayName = `${info.name}, ${info.flag}, ${info.mmsi}`;
    const displayName = `${info.name}}`;
    const displayFlag = `${info.flag}}`;
    const displayMMSI = `${info.mmsi}}`;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-12">Name:{displayName} | </div>
        </div>

        <div className="row">
          <div className="col-md-12">Flag:{displayFlag} | </div>
        </div>

        <div className="row">
          <div className="col-md-12">MMSI:{displayMMSI}</div>
        </div>
      </React.Fragment>
    );

  }
}
