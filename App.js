import React, { Component } from 'react';
import {View, Text, Dimensions, StyleSheet, InteractionManager, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import MapComponent from './source/MapComponent';


class App extends Component {

  constructor(props) {
    super(props);

    // AirBnB's Office, and Apple Park
    this.state = {
      initialGeoPosition : false,
      coordinates: [],
    };
  }

componentDidMount() {
  InteractionManager.runAfterInteractions(()=> {
    let requestLoicationPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    if (Platform.OS == 'ios') {
      requestLoicationPermission = PERMISSIONS.IOS.LOCATION_ALWAYS;
    }
     request(requestLoicationPermission).then(result => {
      console.log(request);
      if (result == 'granted') {
        Geolocation.getCurrentPosition(
          (position) => { 
            let updateCoords = this.state.coordinates;
            if (updateCoords.length >=0 ) {
            updateCoords.length >= 2 && updateCoords.pop()
            updateCoords.push({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude})
            this.setState({coordinates : updateCoords, })
            }
            this.setState({ initialGeoPosition: true});
           },
          (error)    => { console.log(error) },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 10000
          }
        )
        this.watchID = Geolocation.watchPosition((position) => {
          // Create the object to update this.state.mapRegion through the onRegionChange function
         
          let updateCoords = this.state.coordinates;
          if (updateCoords.length >=0 || updateCoords.length <= 2 ) {
            updateCoords.length >= 2 && updateCoords.pop()
          updateCoords.push({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude})
          this.setState({coordinates : updateCoords, })
          }
          // this.onRegionChange(region, region.latitude, region.longitude);
        }, (error)=>console.log(error));
      }
     });
    
  })
}

componentWillUnmount() {
  // Geolocation.clearWatch(this.watchID);
}

  onMapPress = (e) => {
    this.setState({
      coordinates: [
        ...this.state.coordinates,
        e.nativeEvent.coordinate,
      ],
    });
  }

  render() {
    const {initialGeoPosition, coordinates} = this.state;
    return (
      initialGeoPosition ? 
      <MapComponent
      onMapPressed={(e)=> console.log(e.nativeEvent.coordinate)}
      coordinates={this.state.coordinates}
       /> : <View style={{flex: 1, justifyContent: "center"}}><Text style={{textAlign: "center"}}>Getting your location.. this may take a while</Text></View>
    );
  }
}

export default App;