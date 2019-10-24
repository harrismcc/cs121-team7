import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
//tutorial: https://medium.com/@zachrach/spotify-web-api-authorization-with-react-native-expo-6ee1a290b2b0

//Get Redirect URI
import {AuthSession} from 'expo'

//must be installed
import { AsyncStorage } from 'react-native';
import { encode as btoa } from 'base-64';
import { storeParamsCode, getSpotifyAPIToken, deleteAsyncVars, refreshTokens, getValidSPObj, getUserPlaylists } from "./spotifyAuth.js";


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

        <View style={{height: 400}}>
          <ScrollView style={styles.scrollview}>
          {this.state.topPlaylistArray ? (
            this.state.topPlaylistArray.map((item, key)=>(
              <Text key={key} style={styles.TextStyle}> { item.name } </Text>)
              )
          ) : null}
          </ScrollView>
        </View>

        { }
        </View>
    );
  }

  //Press to get auth
  _handlePressAsync = async() => {

    //check if tokens expired
    const tokenExpirationTime = await AsyncStorage.getItem('expirationTime');
    if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
      //if tokens are expired
      await refreshTokens();
    } else {
      //if tokens are not expired
      this.setState({ accessTokenAvailable: true });
    }

    //only call function to auth if API token is not there
    //TODO: Create something for the token timeout - aka run function if token is expired
    if(!this.state.accessTokenAvailable){
      //call on function from spotifyAuth.js
      await getSpotifyAPIToken(); 
    }

    //grab item from AsyncStorage to display under button
    await AsyncStorage.getItem('accessToken').then(value =>
      //AsyncStorage returns a promise so adding a callback to get the value
      this.setState({ getValue: value })
      //Setting the value in Text
      
    );

    const test = await getUserPlaylists();
    this.setState({topPlaylistArray : test })
    
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
