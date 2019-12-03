import React from 'react';
import { Text, View, Button, ScrollView, Image, TouchableOpacity } from 'react-native';
import { AuthorizeWithSpotify } from "./spotifyAuth.js";
import { AsyncStorage } from 'react-native';
import * as Permissions from 'expo-permissions';

// This page also has the buttons to navigate to other pages

//StyleSheet
import {styles} from './stylesheet.js'

//This page is the main page that shows the lists of playlist names
export class MainScreen extends React.Component {
    static navigationOptions = {
      title: 'MainScreen',
      backgroundColor: "#339900",
    };
  
   constructor(props) {
    super(props);
     
    //set default state
    this.state = {
      result: null,
    };
   }
    
   render() {
    const {navigate} = this.props.navigation;
    return (
       
      <View style={styles.container}>
        <View>
          <TouchableOpacity onPress={() => navigate('SpotifyAuth')}/>
          <Image
                    source={require('./assets/green_button.png')}
                    style={styles.mainButton}
                    onPress={() => navigate('SpotifyAuth')}
                   />
        </View>
            <View>
                <View style = {styles.mainButton}>
                   <Image
                    source={require('./assets/green_button.png')}
                    style={styles.mainButton}
                    onPress={() => navigate('SpotifyAuth')}
                   />
                </View>

    </View>
    </View>
    );
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
      
    
  }