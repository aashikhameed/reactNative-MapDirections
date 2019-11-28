import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 13.076349;
const LONGITUDE = 80.199552;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyCsdnie49syF6ZMPK2pzjpRbnTwdPcaKrU';

class MapComponent extends Component {

  constructor(props) {
    super(props);

    // AirBnB's Office, and Apple Park
    this.state = {
      coordinates: this.props.coordinates,
      initialCoords: undefined,
    };

    this.mapView = null;
  }

  onMapPress = (e) => {
    this.props.onMapPressed(e.nativeEvent.coordinate);
    // this.setState({
    //   coordinates: [
    //     ...this.state.coordinates,
    //     e.nativeEvent.coordinate,
    //   ],
    // });
  }


  static getDerivedStateFromProps(nextProp, state) {
    // if (
    //   JSON.stringify(nextProp.coordinates) !== JSON.stringify(state.coordinates)
    // ) {
    console.log(nextProp);
      return { coordinate: nextProp.coordinates, initialCoords: nextProp.coordinates[0] };
    // }
    // return null;
  }

  render() {
    if (this.state.initialCoords !== undefined)
      return (
        <MapView
          initialRegion={{
            latitude: this.state.initialCoords.latitude,
            longitude: this.state.initialCoords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          style={StyleSheet.absoluteFill}
          ref={c => this.mapView = c}
          onPress={this.onMapPress}
        >
          {this.state.coordinates.map((coordinate, index) =>
            <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
          )}
          {(this.state.coordinates.length >= 2) && (
            <MapViewDirections
              origin={this.state.coordinates[0]}
              waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : null}
              destination={this.state.coordinates[this.state.coordinates.length - 1]}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="blue"
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
              }}
              onReady={result => {
                console.log('Distance: ${result.distance} km')
                console.log('Duration: ${result.duration} min.')

                this.mapView.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: (width / 20),
                    bottom: (height / 20),
                    left: (width / 20),
                    top: (height / 20),
                  }
                });
              }}
              onError={(errorMessage) => {
                // console.log('GOT AN ERROR');
              }}
            />
          )}
        </MapView>
      );
      else 
      return null
  }
}

export default MapComponent;