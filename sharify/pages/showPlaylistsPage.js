import React from 'react';
import { Text, View, Button, ScrollView } from 'react-native';
import { AsyncStorage } from 'react-native';
import { getUserTopPlaylists, getUserTopTracks, testRec} from "../spotifyAuth.js";

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

          <View style={[{margin:10, flexDirection: 'row'}]}>
            <Button style={{margin:5}} title="Show Playlists" onPress={this._test} />
            <Button style={{margin:5}} title="Recs Test Page" onPress={() => navigate('RecsPage')}/>
          </View>
          <View style={[{margin: 10}]}>
            <Button  title="Play Music" onPress={() => navigate('MusicPage')}/>
          </View>


          <View style={{height: 400}}>
            <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}>
            {this.state.topPlaylistArray ? (
              this.state.topPlaylistArray.map((item, key)=>(

                <View key ={key} style={styles.songDisplayRowItem} >
                  <Text key={key + this.state.topPlaylistArray.length} style={styles.TextStyle}> { item.name }</Text>
                </View>
              ))
            ) : null}
            </ScrollView>
          </View>
          </View>
      );
    }
  
    _test = async () => {
      
      //add top playlists to state
      const playlists = await getUserTopPlaylists();
      this.setState({accessToken : await AsyncStorage.getItem('accessToken')});
      this.setState({topPlaylistArray : playlists});
      
     
    }
  
  
    
  }