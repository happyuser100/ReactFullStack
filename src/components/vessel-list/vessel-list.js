import React, { Component } from "react";
// import fleets from "../../components/data/fleets.json";
// import vessels from "../../components/data/vessels.json";
import "./vessel-list.css";
import SearchPanel from "../../components/search-panel";
// import FleetVesselService from "./../../services/fleet-vessel-service";
import { Link } from "react-router-dom";
import VesselsMap from "./VesselsMap";
import VesselInfo from "./VesselInfo";

import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";

import MapGL, { Popup } from "react-map-gl";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZmxlaWRtb3MiLCJhIjoiY2tobnJpemQxMDRrczMxcGU3ejZyMHB5aCJ9.Q3Tt5vnPUBzwOmoT2wpyJA"; // Set your mapbox token here

export default class VesselList extends Component {
  _apiBase = "http://localhost:9000/testAPI/";

  // fleetVesselService = new FleetVesselService();

  state = {
    viewport: {
      latitude: 37.8,
      longitude: -122.4,
      zoom: 14,
      bearing: 0,
      pitch: 0,
    },
    popupInfo: null,
  };

  state = {
    sort: [
      { field: "id", dir: "asc" },
      { field: "name", dir: "asc" },
      { field: "mmsi", dir: "asc" },
      { field: "flag", dir: "asc" },
    ],

    fleet: {},
    fleets: [],
    vessels: [],
    vesselLocations: [],
    vesselLocationsMap: [],

    loading: true,
    error: false,

    searchName: "",
    searchMMSI: "",
    searchFlag: "",
  };

  _onClickMarker = (city) => {
    this.setState({ popupInfo: city });
  };

  _renderPopup() {
    const { popupInfo } = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <VesselInfo info={popupInfo} />
        </Popup>
      )
    );
  }

  onSearchChangeName = (search) => {
    this.setState({ searchName: search });
  };

  onSearchChangeMMSI = (search) => {
    this.setState({ searchMMSI: search });
  };

  onSearchChangeFlag = (search) => {
    this.setState({ searchFlag: search });
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
      .catch(this.onError);
  };

  onFleetsLoaded = (data) => {
    debugger;
    this.setState({
      fleets: data,
      loading: true,
      error: false,
    });

    let id = this.props.match.params.id;
    const item = data.find((x) => x._id === id);
    this.setState({
      fleet: item,
      loading: true,
      error: false,
    });

    this.getAllVessels();
  };

  // getFleetsById = (id) => {
  //   let url = "fleet";
  //   fetch(`${this._apiBase}${url}/${id}`)
  //     .then((response) => response.json())
  //     .then(this.onFleetsByIdLoaded)
  //     .catch(this.onError);
  // };

  // onFleetsByIdLoaded = (data) => {
  //   this.setState({
  //     fleet: data.Fleet,
  //     loading: true,
  //     error: false,
  //   });
  // };

  getAllVessels = () => {
    let url = "Vessels";
    fetch(`${this._apiBase}${url}`)
      .then((response) => response.json())
      .then(this.onVesselsLoaded)
      .catch(this.onError);
  };

  onVesselsLoaded = (data) => {
    this.setState({
      vessels: data,
      loading: true,
      error: false,
    });

    this.getAllVesselLocations();
  };

  onError = (err) => {
    this.setState({
      error: true,
      loading: true,
    });
  };

  getAllVesselLocations = () => {
    let url = "vesselLocations";
    fetch(`${this._apiBase}${url}`)
      .then((response) => response.json())
      .then(this.onVesselLocationsLoaded)
      .catch(this.onError);
  };

  removeNull(array) {
    return array.filter((x) => x !== null);
  }

  onVesselLocationsLoaded = (data) => {
    let vessels = this.state.fleet.vessels;

    const vesselLocationsByFleet = data.VesselLocations.map((item) => {
      let id = item._id;
      let vesselItem = vessels.filter((vessel) => vessel._id === id);
      if (vesselItem && vesselItem.length > 0) return item;
      else return null;
    });

    this.setState({
      vesselLocations: this.removeNull(vesselLocationsByFleet),
      loading: true,
      error: false,
    });

    this.getVesselLocationsMap();
  };

  getVesselLocationsMap = () => {
    const vesselLocationsMap = this.state.vesselLocations.map(
      (vesselLocationItem) => {
        let id = vesselLocationItem._id;
        let lastpos = vesselLocationItem.lastpos;
        let longitude = lastpos.geometry.coordinates[0];
        let latitude = lastpos.geometry.coordinates[1];

        let name = "";
        let flag = "";
        let mmsi = ";";
        let vessel = this.state.vessels.Vessels.find((x) => x._id === id);
        if (vessel) {
          name = vessel.name;
          flag = vessel.flag;
          mmsi = vessel.mmsi;
        }

        const obj = {
          id: id,
          latitude: latitude,
          longitude: longitude,
          name: name,
          flag: flag,
          mmsi: mmsi,
        };
        return obj;
      }
    );

    this.setState({
      vesselLocationsMap: vesselLocationsMap,
      loading: false,
      error: false,
    });
  };
  
  render() {
    const { searchName, searchMMSI, searchFlag } = this.state;
    const {
      fleet,
      vessels,
      loading,
      error,
      vesselLocationsMap,
    } = this.state;

    if (loading) {
      return <p>Loading ...</p>;
    }

    const hasData = !(loading || error);

    // here

    let vesselsByFleet = this.state.fleet.vessels;

    debugger;
    let itemsGrid = vesselsByFleet.map((item) => {
      let vesselItem = vessels.Vessels.filter((x) => x._id === item._id);
      let chkName =
        vesselItem && vesselItem[0] && vesselItem[0].name
          ? vesselItem[0].name
              .toLowerCase()
              .includes(searchName.toLowerCase())
          : false;
      let chkMMSI =
        vesselItem && vesselItem[0] && vesselItem[0].mmsi
          ? vesselItem[0].mmsi
              .toString()
              .toLowerCase()
              .includes(searchMMSI.toLowerCase())
          : false;
      let chkFlag =
        vesselItem && vesselItem[0] && vesselItem[0].flag
          ? vesselItem[0].flag
              .toLowerCase()
              .includes(searchFlag.toLowerCase())
          : false;

      const results =
        chkName && chkMMSI && chkFlag
          ? {
              id: vesselItem[0]._id,
              name: vesselItem[0].name,
              mmsi: vesselItem[0].mmsi,
              flag: vesselItem[0].flag,
            }
          : null;

      return results;
    });

    itemsGrid = this.removeNull(itemsGrid);

    return (
      <React.Fragment>
        <div className="container">
          <h1>Vessels Page</h1>
          <div className="row">
            <div className="col-md-12">
              <Link to="/fleets">Back to Fleets</Link>{" "}
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <h3>{fleet.name}</h3>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="top-panel d-flex">
                <SearchPanel
                  onSearchChangeName={this.onSearchChangeName}
                  onSearchChangeMMSI={this.onSearchChangeMMSI}
                  onSearchChangeFlag={this.onSearchChangeFlag}
                />
              </div>

              <Grid
                style={{ height: "250px" }}
                data={orderBy(itemsGrid, this.state.sort)}
                sortable
                sort={this.state.sort}
                onSortChange={(e) => {
                  this.setState({
                    sort: e.sort,
                  });
                }}
              >
                <Column field="id" title="Id" width="250px" />
                <Column field="name" title="Name" width="200px" />
                <Column field="mmsi" title="MMSI" width="200px" />
                <Column field="flag" title="Flag" width="200px" />
              </Grid>

            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <MapGL
                {...this.state.viewport}
                width="100vw"
                height="100vh"
                mapStyle="mapbox://styles/mapbox/dark-v9"
                onViewportChange={(viewport) => this.setState({ viewport })}
                mapboxApiAccessToken={MAPBOX_TOKEN}
              >
                <VesselsMap
                  data={vesselLocationsMap}
                  onClick={this._onClickMarker}
                />
                {this._renderPopup()}
              </MapGL>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
