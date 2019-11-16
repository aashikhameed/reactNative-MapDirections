import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');

const GOOGLE_MAPS_APIKEY = 'AIzaSyCR8LQjxVMyACm_8443h2XiM-OdvWWMp-s';

export default class MapComponent extends React.Component {

    render() {
        const {initialGeoPosition, onMapPressed, startEndCoords} = this.props;
        return (
            <MapView
        initialRegion={initialGeoPosition}
        style={StyleSheet.absoluteFill}
        ref={c => this.mapView = c}
        onPress={(e)=> onMapPressed(e)}
      >
        {/* {startEndCoords.map((coordinate, index) =>
          <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
        )} */}

        {(startEndCoords.length >= 2) && (
          <MapViewDirections
            origin={startEndCoords[0]}
            waypoints={ (startEndCoords.length > 2) ? startEndCoords.slice(1, -1): null}
            destination={startEndCoords[startEndCoords.length-1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
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
        )
    }


}