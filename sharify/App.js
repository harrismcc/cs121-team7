import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
//tutorial: https://medium.com/@zachrach/spotify-web-api-authorization-with-react-native-expo-6ee1a290b2b0

//pagination
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';


//must be installed
import { AsyncStorage } from 'react-native';
import { storeParamsCode, getSpotifyAPIToken, deleteAsyncVars, refreshTokens, getValidSPObj, getUserPlaylists } from "./spotifyAuth.js";

class SpotifyAuthButton extends React.Component{
 

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

    
  }
  
}


class ShowPlaylists extends React.Component {
  static navigationOptions = {
    title: 'Show Playlists',
  };

 constructor(props) {
  super(props);
   
  //set default state
  this.state = {
    result: null,
  };

  

  //checks if tokens are valid and gets new ones
  //TODO: Not totally sure this works. What if I have an API token stored but it need to be refreshed?
  this.checkTokenValid = async () => {
    //check if tokens expired
    const tokenExpirationTime = await AsyncStorage.getItem('expirationTime');
    if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
      //if tokens are expired
      await refreshTokens(); //refresh them
      this.setState({ accessTokenAvailable: true });//mark them as valid

    } else {
      //if tokens are not expired
      this.setState({ accessTokenAvailable: true });//mark them as valid
    }
  }

  //helper function to get data from AsyncStorage
  this.getData = async (key) => {
    const value = await AsyncStorage.getItem(key);
    return value;
  };
  
  //bind functions after all function definitions
  this.getData = this.getData.bind(this);
  this.checkTokenValid = this.checkTokenValid.bind(this);
 
  //for debugging, print out if access token is available
  this.checkTokenValid().then(() => {
    console.log("Access Token Available: " + this.state.accessTokenAvailable);
  })

  //THIS IS THE KEY! HOW TO GET DATA OUT OF ASYNC PROMISE!
  //WOOHOOOO!
  //This sets the access token in state
  this.getData('accessToken').then(key => {
      this.setState({
          accessToken:key
      });
    })
    .catch(error =>{
      console.error(error);
    });

  

 }
  


  render() {
    
    const {navigate} = this.props.navigation;
    return (
      
      <View style={styles.container}>
        <View style={[{margin: 10}]}>
          <Button  title="auth" onPress={() => navigate('SpotifyAuth')}/>
        </View>

      {this.state.accessToken ? 
      
        <Button title="Show Playlists" onPress={this._test} /> 
        : null
        }

        
       
        <View style={{height: 400}}>
          <ScrollView style={styles.scrollview}>
          {this.state.topPlaylistArray ? (
            this.state.topPlaylistArray.map((item, key)=>(
              <Text key={key} style={styles.TextStyle}> { item.name } </Text>)
              )
          ) : null}
          </ScrollView>
        </View>
        </View>
    );
  }

  _test = async () => {
    
    const playlists = await getUserPlaylists();
    this.setState({accessToken : await AsyncStorage.getItem('accessToken')});
    this.setState({topPlaylistArray : playlists});
  }


  
  
}

class AuthorizeWithSpotify extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Please Authorize With Spotify</Text>
        <SpotifyAuthButton></SpotifyAuthButton>
      </View>

    )
  }
}

//init
const MainNavigator = createStackNavigator({
  Home: {screen: ShowPlaylists},
  SpotifyAuth: {screen: AuthorizeWithSpotify},
});

const App = createAppContainer(MainNavigator);

export default App;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
