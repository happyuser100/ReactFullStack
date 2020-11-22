import React, { Component } from "react";

export default class SearchPanel extends Component {
  state = {
    termName: "",
    termMMSI: "",
    termFlag: ""
  };

  constructor() 
  {
      super();
      this.refName = React.createRef();
      this.refMMSI = React.createRef();
      this.refFlag = React.createRef();
  }

  onSearchChangeName = (e) => {
    const term = e.target.value;
    this.setState({termName: term });
    this.props.onSearchChangeName(term);
  };

  onSearchChangeMMSI = (e) => {
    const term = e.target.value;
    this.setState({termMMSI: term });
    this.props.onSearchChangeMMSI(term);
  };

  onSearchChangeFlag = (e) => {
    const term = e.target.value;
    this.setState({termFlag: term });
    this.props.onSearchChangeFlag(term);
  };

  search = (e) =>
  {
    e.preventDefault();
    debugger
    let criteriaName = this.refName.current.value.trim();;      
    this.props.onSearchChangeName(criteriaName);

    let criteriaMMSI = this.refMMSI.current.value.trim();      
    this.props.onSearchChangeMMSI(criteriaMMSI);

    let criteriaFlag = this.refFlag.current.value.trim();      
    this.props.onSearchChangeFlag(criteriaFlag);
  }

  render() {
    return (
      <div className="row">
        <div className="col-3">
          <label htmlFor="name">Search By Name: </label> 
          <input
            ref={this.refName}
            id="name"
            className="form-control search-input"
            placeholder="Type to search name"
            value={this.state.termName}
            onChange={this.onSearchChangeName}
          />
        </div>

        <div className="col-3">
        <label htmlFor="MMSI">Search By MMSI: </label>   
          <input
            ref= {this.refMMSI}
            id="MMSI"
            className="form-control search-input"
            placeholder="Type to search MMSI"
            value={this.state.termMMSI}
            onChange={this.onSearchChangeMMSI}
          />
        </div>

        <div className="col-3">
        <label htmlFor="Flag">Search By Flag: </label>   
          <input
            ref={this.refFlag}
            id="Flag"
            className="form-control search-input"
            placeholder="type to search flag"
            value={this.state.termFlag}
            onChange={this.onSearchChangeFlag}
          />
        </div>

        <div className="col-3">
          <button id="btnSeacrh" type="button" onClick={this.search} className="btn btn-primary">Search</button>
        </div>

      </div>
    );
  }
}
