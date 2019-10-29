import React from 'react';
import {AuthSession} from 'expo'
import { AsyncStorage, Text, View, Button, TouchableOpacity, Image} from 'react-native';
import { encode as btoa } from 'base-64';
import { spotifyCredentials } from './secrets.js';
import SpotifyWebAPI from 'spotify-web-api-js';

//StyleSheet
import {styles} from './stylesheet.js'

//array of scopes for spotify API
const scopesArr = ['user-modify-playback-state','user-read-currently-playing','user-read-playback-state','user-library-modify',
                   'user-library-read','playlist-read-private','playlist-read-collaborative','playlist-modify-public',
                   'playlist-modify-private','user-read-recently-played','user-top-read'];
const scopes = scopesArr.join(' ');


//This function clears all AsyncVars and should 
// only be used when testing
export const deleteAsyncVars = async () => {
    console.log("Clearing AsyncVars");
    try {
      await AsyncStorage.removeItem('resultParamsCode');
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('expirationTime');
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  }

//This function gets the one time use code that is 
//used later to get the API Token for each user
export const storeParamsCode = async () => {
    let credentials = spotifyCredentials
    let redirectUrl = AuthSession.getRedirectUrl(); 
    let result = await AuthSession.startAsync({
      authUrl:
        'https://accounts.spotify.com/authorize' +
        '?client_id=' +
        credentials.clientId +
        '&response_type=code' +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' +
        encodeURIComponent(redirectUrl),
    });
    //AFTER TOKEN COMPLETION
    //Place Token in AsyncStorage
    try{
      await AsyncStorage.setItem('resultParamsCode', result.params.code);
      return result.params.code;
    }
    catch(error){
      //return error message and redirect URI
      console.log("storeParamsCode() Error: " + error.message);
      console.log("Redirect URI: " + AuthSession.getRedirectUrl());

      //try again
      return storeParamsCode();
    }
  }


  //This function uses the one above to get the
  //API token for each user
  export const getSpotifyAPIToken = async () => {

    //store params code is AsyncStorage
    await storeParamsCode(); //use await to ensure code is loaded first
  
    //access authorization code from AsyncStorage
    let authorizationCode = await AsyncStorage.getItem('resultParamsCode') || 'none'  //we wrote this function above
    console.log("Code: " + authorizationCode);
    
  
    //Grab Spotify Developer Credentials from hacky const
    let credentials = spotifyCredentials;
    
    let credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
    let response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${
        credentials.redirectUri
      }`,
    });
    let responseJson = await response.json();
    // destructure the response and rename the properties to be in camelCase
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = responseJson;
  
    let expirationTime = new Date().getTime() + expiresIn * 1000;

  
    try{
      //store access token in AsyncStorage
      await AsyncStorage.setItem('accessToken', accessToken);
      //store refreshToken is AsyncStorage
      await AsyncStorage.setItem('refreshToken', refreshToken);
      //store expirationTime in AsyncStorage
      await AsyncStorage.setItem('expirationTime', String(expirationTime));
    }
    catch(error){
      console.log("Error: " + error);
    }
  
  
    //TODO: Delete log of access token
    console.log("ACCESS TOKEN: " + accessToken);
  
  
  
  };


  //Get new tokens using the refresh token
  export const refreshTokens = async () => {
    try {
      const credentials = spotifyCredentials;
      const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credsB64}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      });
      const responseJson = await response.json();
      if (responseJson.error) {
        //gets api tokens in the first place, if none are present
        await getSpotifyAPIToken();
      } else {
        const {
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
          expires_in: expiresIn,
        } = responseJson;
  
        const expirationTime = new Date().getTime() + expiresIn * 1000;

        await AsyncStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
        }
        
        await AsyncStorage.setItem('expirationTime', String(expirationTime));
    }
    } catch (err) {
      console.error(err)
    }
  }

  

//Function to test if tokens are valid
export const getValidSPObj = async () => {
  const tokenExpirationTime = await AsyncStorage.getItem('expirationTime');
  if (new Date().getTime() > tokenExpirationTime) {
    // access token has expired, so we need to use the refresh token
    await refreshTokens();
  }
  const accessToken = await AsyncStorage.getItem('accessToken');
  var sp = new SpotifyWebAPI();
  await sp.setAccessToken(accessToken);
  return sp;
}

//function to get top 50 playlists from user
export const getUserTopPlaylists = async () => {
    const sp = await getValidSPObj();
    const { id: userId } = await sp.getMe();
    const { items: playlists } = await sp.getUserPlaylists(userId, { limit: 50 });
    return playlists;
  };

//pulls a users top 50 tracks
export const getUserTopTracks = async () => {
  const sp = await getValidSPObj();
  //const { id: userId } = await sp.getMe();
  const { items: tracks } = await sp.getMyTopTracks({ limit: 50 });
  return tracks;
}

//a test function that takes in values and returns reccomendations
export const testRec = async (danceabilityVal, energyVal, popularityVal, valenceVal) => {
  const sp = await getValidSPObj();

  const {tracks: recs} = await sp.getRecommendations({seed_tracks: '6rPO02ozF3bM7NnOV4h6s2',
                                                       danceability: danceabilityVal,
                                                      energy: energyVal,
                                                      popularity: popularityVal,
                                                      valence: valenceVal});
  return recs;
}


//an unfinished function to search for a track
export const searchForTracks = async () => {
  const sp = await getValidSPObj();

  const {tracks: tracks} = await sp.searchTracks("April Come She Will", {limit: 2});
  return tracks;
}


////COMPONENTS AND CLASSES////
//TODO: Move this page into the pages folder

//This is a custom component that is a special button to auth with spotify
export class SpotifyAuthButton extends React.Component{
 
  state = {
    result: null,
  };
  
  render() {
    return (
       
      <View style={styles.container}>
        <View>

          <TouchableOpacity onPress = {this._handlePressAsync}>
                <View style = {styles.spotifyAuthButton}>
                   <Image
                   source={require('./assets/spotifyLogo.png')}
                   style={{height:20, width:20, margin:10}}
                   />
                    <Text style = {{color: 'white'}}>Connect To Spotify</Text>
                </View>
            </TouchableOpacity>

        </View>
        {this.state.getValue ? (
          <Text>API Access Token (Stored in Async Storage): {this.state.getValue}</Text>
        ) : null}

    </View>
    );
  }

  
  //Press to get auth
  _handlePressAsync = async() => {

    //validate API link
    getValidSPObj();

    //grab item from AsyncStorage to display under button
    await AsyncStorage.getItem('accessToken').then(value =>
      //AsyncStorage returns a promise so adding a callback to get the value
      this.setState({ getValue: value })
      //Setting the value in Text
      
    );

    
  }
  
}

//This is the actual page with the spotify auth button
export class AuthorizeWithSpotify extends React.Component {
  static navigationOptions = {
    title: 'Please Authorize With Spotify',
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <SpotifyAuthButton></SpotifyAuthButton>
      </View>

    )
  }
}