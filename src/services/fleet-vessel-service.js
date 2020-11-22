export default class FleetVesselService {
  _apiBase = "http://localhost:9000/testAPI/";

  getResource = (url) => {
    const res = fetch(`${this._apiBase}${url}`);

    // if (!res.ok) {
    //   throw new Error(`Could not fetch ${url}, received ${res.status}`);
    // }

    return res.json();
  };

  getFleets = () => {
    debugger;
    const res = this.getResource(`fleets/`);
    return res.fleets;
  };

  getVessels = () => {
    const res = this.getResource(`vessels/`);
    return res.vessels;
  };

  getVesselLocations = () => {
    const res = this.getResource(`vesselLocations/`);
    return res.vessels;
  };
}
