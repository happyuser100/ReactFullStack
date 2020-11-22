import React, { Component } from "react";
import { Link } from "react-router-dom";
// import fleets from "../../components/data/fleets.json";
import FleetVesselService from "./../../services/fleet-vessel-service";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";

export default class FleetList extends Component {
  _apiBase = "http://localhost:9000/testAPI/";

  fleetVesselService = new FleetVesselService();

  state = {
    fleets: [],
    loading: true,
    error: false,
    sort: [
      { field: "name", dir: "asc" },
      { field: "cnt", dir: "asc" },
    ],
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.getAllFleets();
  }

  getAllFleets = () => {
    let url = "fleets";
    fetch(`${this._apiBase}${url}`)
      .then((response) => response.json())
      .then(this.onFleetsLoaded)
      .catch(this.onError)
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  onFleetsLoaded = (data) => {
    this.setState({
      fleets: data,
      loading: false,
      error: false,
    });
  };

  onError = (err) => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  render() {
    const { fleets, loading, error } = this.state;

    if (loading) {
      return <p>Loading ...</p>;
    }

    const hasData = !(loading || error);
    return hasData ? (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1>Fleets Page</h1>

              <Grid
                style={{ height: "500px" }}
                data={orderBy(fleets, this.state.sort)}
                sortable
                sort={this.state.sort}
                onSortChange={(e) => {
                  this.setState({
                    sort: e.sort,
                  });
                }}
              >
                <Column
                  field="name"
                  title="Name"
                  width="250px"
                  cell={(props) => (
                    <td>
                      <Link to={`/vessels/${props.dataItem["_id"]}`}>
                        {props.dataItem[props.field]}
                      </Link>
                    </td>
                  )}
                />
                <Column
                  field="cnt"
                  title="Vessels Number"
                  width="200px"
                  cell={(props) => (
                    <td>
                      <Link to={`/vessels/${props.dataItem["_id"]}`}>
                        {props.dataItem[props.field]}
                      </Link>
                    </td>
                  )}
                />
              </Grid>
            </div>
          </div>
        </div>
      </React.Fragment>
    ) : null;
  }
}
