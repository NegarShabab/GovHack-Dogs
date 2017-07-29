import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMap from 'google-map-react';
import PointsRepository from './PointsRepository';
import MapPoint from "./MapPoint";
import {geolocated} from 'react-geolocated';
import MapPointYourLocation from "./MapPointYourLocation";

const gmapsApiKey = "AIzaSyAFVS3VoZHTceJd3snrMVWb1NtihK8XsVk";

class GetMapStuff extends Component {
  state = {};

  GetPoints() {
    let url = `http://203.122.234.198:5000/parks?lat=${this.props.latitude}&lng=${this.props.longitude}`;
    PointsRepository.GetPointsFromApiRens(url)
      .then((responseJson) => {
        console.log(responseJson);
        let array = responseJson.data;
        if(array === null)
          return;
        let pointComponents = array.map((point, i) => {
          return <MapPoint
            key={"a" + i}
            text={point.ParkName}
            lat={point.lat}
            lng={point.lng}
          />;
        });
        this.setState({points: pointComponents})})
      .catch((val) => console.log(val));
  }

  _onChildClick = (key, childProps) => {
    alert(childProps.text);
  };

  render () {
    this.GetPoints();

    return (
      <div style={{width:"100vw", height:"100vh"}} >
        <GoogleMap
          bootstrapURLKeys={{key: gmapsApiKey}}
          center={[this.props.latitude,this.props.longitude]}
          zoom={this.props.zoom}
          onChildClick={this._onChildClick}
        >
          { this.state.points }
          <MapPointYourLocation
            text={"You're Here"}
            lat={this.props.latitude}
            lng={this.props.longitude}
          />
        </GoogleMap>
      </div>
    );
  }
}

class MapsView extends Component {
  render() {
    return !this.props.isGeolocationAvailable
      ? <div>Your browser does not support Geolocation</div>
      : !this.props.isGeolocationEnabled
        ? <div>Geolocation is not enabled</div>
        : this.props.coords
          ? <GetMapStuff
              zoom={this.props.zoom}
              latitude={this.props.coords.latitude}
              longitude={this.props.coords.longitude}
            />
          : <div>Getting the location data&hellip; </div>;
  }
}

MapsView.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number
};

MapsView.defaultProps = {
  center: [-34.89, 138.6007],
  zoom: 14
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(MapsView);
