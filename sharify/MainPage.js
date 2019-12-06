import React from 'react';
import { Text, View, Button, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import * as Permissions from 'expo-permissions';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { getValidSPObj} from "./spotifyAuth.js";

// This page also has the buttons to navigate to other pages

import MainPageShow from "./src/components/MainPageShow.js"
import CreatePlaylistButton from "./src/components/CreatePlaylistButton.js"
//StyleSheet
import {styles} from './stylesheet.js'

//This page is the main page that shows the lists of playlist names
export class MainScreen extends React.Component {
  state = { loggedIn: null };
  
  
    static navigationOptions = {
      title: 'Sharify',
      backgroundColor: "#555555", 
      header : null,
    };
  
   constructor(props) {
    super(props);
     
    //set default state
    this.state = {
      result: null,
    };

    console.disableYellowBox = true;
   }
   
   render() {
    const config = {
      velocityThreshold: 0.2,
      directionalOffsetThreshold: 80
    };
    const {navigate} = this.props.navigation;
    return (
      <View style={{backgroundColor : "#1D1C17"}}>
                <GestureRecognizer
                onSwipeLeft={() => navigate("JoinPage")}
                onSwipeRight={() => navigate("HostPage")}
                config={config}
                >
                    <View style={{height : '100%', alignItems : 'center', justifyContent : 'center'}}>
                        <Image 
                          style={{width:300, height:300}}
                          source={require("./assets/icon.png")}
                        ></Image>
                        <Text style={{
                          marginLeft : 5,
                          color:'white',
                          fontWeight: 'bold',
                          fontSize: 70,
                        }}>Sharify</Text>
                    </View>
                </GestureRecognizer>
                <View style={styles.submitButton}>
                 <Button title = "Log in" color = "white" onPress={() => navigate('LoginPage')}/>
               </View>
            </View>
      // <View style={styles.container}>
      //   <ImageBackground 
      //     style={styles.buttonImage}
      //     source={require('./assets/green_button.png')}
      //     onPress={() => navigate('HostPage')}
      //   >
      //       <View style={styles.hostButton}>
      //         <Button title = "Host" color = "black" onPress={() => navigate('HostPage')}/>
      //       </View>
      //   </ImageBackground>
      //   <ImageBackground 
      //     style={styles.buttonImage2}
      //     source={require('./assets/green_button.png')}
      //     onPress={() => navigate('HostPage')}
      //   >
      //       <View style={styles.joinButton}>
      //         <Button title = "Join" color = "black" onPress={() => navigate('JoinPage')}/>
      //       </View>
      //   </ImageBackground>
      //   <View style={styles.submitButton}>
      //         <Button title = "Log in" color = "white" onPress={() => navigate('LoginPage')}/>
      //       </View>
      // </View>
    );
  }
  
  renderComponent() {
    if (this.state.loggedIn) {
      return ("Log out")
    } else {
      return ("Log out")
    }
  }

    qrnavigation = async() => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      
      if (status == 'granted'){
        return true
      }else{
        console.log("NO CAMERA ACCESS")
        return false
      }
    }
    onSwipeRight(gestureState) {
      const navigate = this.props.navigation;
      alert("Right Swipe!")
      navigate("JoinPage")
  }

  _getUserData = async () => {

      const sp = await getValidSPObj();
      const { id: userId } = await sp.getMe();     

      this.setState({
          "tempVar": "Data grabbed."
      }, () => {
      });

  };

  _resumePlayback = async () => {

      const sp = await getValidSPObj();
      const { id: userId } = await sp.getMe(); 
      
      sp.play()
      
              this.setState({
                  "tempVar": "Resuming Playback on Active Device."
              }, () => {
              });
      
          };


  _generatePlaylist = async () => {

      //createNewPlaylist(this.state.name, this.state.description, this.state.isPublic)
      createAsHost(this.state.name, this.state.description, this.state.isPublic)

      //sp.createPlaylist(userId, {"name" : this.state.name, "public" : this.state.isPublic, "collaborative" : this.state.isCollab, "description" : this.state.description});
      

          this.setState({
              "tempVar": "You just created a collaborative playlist."
          }, () => {
          });
      alert("Playlist " + this.state.name + " created!")
  
      };

  _addToPlaylists = async () => {

      const sp = await getValidSPObj();
      const { id: userId } = await sp.getMe(); 

      var songs = [this.state.song1ToAdd, this.state.song2ToAdd]
      sp.addTracksToPlaylist(this.state.playlist_id, songs )
      
      this.setState({
          "tempVar": "The songs in the array were added."
      }, () => {
      });
          
}

  _addTopTracksToPlaylists = async () => {
  
      const sp = await getValidSPObj();
      const { id: userId } = await sp.getMe(); 

      songs = await sp.getMyTopTracks({"time_range" : this.state.timeRange});
      
      // this should loop through until the output is null or until the max number of songs desired is reached rather than
      // the current implementation of just brute searching
      var index;
      var songsParsed = []
      for (index = 0; index < this.state.maxContributions; index++) {
          songsParsed.push(songs.items[index].uri);
      }
      console.log(songsParsed)
      sp.addTracksToPlaylist(this.state.playlist_id, songsParsed);
      
      this.setState({
          "tempVar": "Your favorite songs have been added to the collab playlist.",
      }, () => {
      });
  
  }
    
  }