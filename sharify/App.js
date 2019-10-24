import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
//tutorial: https://medium.com/@zachrach/spotify-web-api-authorization-with-react-native-expo-6ee1a290b2b0

//Get Redirect URI
import {AuthSession} from 'expo'

//must be installed
import { AsyncStorage } from 'react-native';
import { encode as btoa } from 'base-64';

import { storeParamsCode, getSpotifyAPIToken, deleteAsyncVars } from "./spotifyAuth.js";

deleteAsyncVars();

export default class App extends React.Component {
  state = {
    result: null,
  };


  render() {
    return (
      <View style={styles.container}>
        <Button title="Open Spotify Auth" onPress={this._handlePressAsync} />
        {this.state.getValue ? (
          <Text>API Access Token (Stored in Async Storage): {this.state.getValue}</Text>
        ) : null}
        </View>
    );
  }

  //Press to get auth
  _handlePressAsync = async() => {
    
    //only call function to auth if API token is not there
    //TODO: Create something for the token timeout - aka run function if token is expired
    if(!(await AsyncStorage.getItem('accessToken'))){
      //call on function from spotifyAuth.js
      await getSpotifyAPIToken(); 
    }

    //grab item from AsyncStorage to display under button
    await AsyncStorage.getItem('accessToken').then(value =>
      //AsyncStorage returns a promise so adding a callback to get the value
      this.setState({ getValue: value })
      //Setting the value in Text
      
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
