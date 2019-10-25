import React from 'react';
import { Text, View, Button, ScrollView } from 'react-native';
import { AsyncStorage } from 'react-native';
import { getUserPlaylists} from "../spotifyAuth.js";

//StyleSheet
import {styles} from '../stylesheet.js'

//This page is the main page that shows the lists of playlist names
export class ShowPlaylists extends React.Component {
    static navigationOptions = {
      title: 'Show Playlists',
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
          <View style={[{margin: 10}]}>
            <Button  title="Go To Auth Page" onPress={() => navigate('SpotifyAuth')}/>
          </View>
          <View style={[{margin: 10}]}>
            <Button  title="Go To Login Page" onPress={() => navigate('LoginPage')}/>
          </View>
          <View style={[{margin: 10}]}>
            <Button title="Show Playlists" onPress={this._test} />
          </View>

          
  
          
  
          
         
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