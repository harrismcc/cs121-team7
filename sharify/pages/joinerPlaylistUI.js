import React, { Component } from 'react';
import { View, Button, Text, ScrollView, AsyncStorage } from 'react-native';
import firebase from 'firebase';
import {styles} from '../stylesheet.js'
import { getValidSPObj } from "../spotifyAuth.js";
import ShowPlaylists from "../src/components/ShowPlaylists.js"
import CreatePlaylistButton from "../src/components/CreatePlaylistButton.js"


export default class joinerPage extends Component {
    static navigationOptions = {
        title: 'Join Page',
        headerStyle: {
            backgroundColor : '#070600',
            //backgroundColor : '#FCA311',
            
          },
          headerTintColor : 'white'
      };

    // Hard-coded song data to be changed to play any song
    constructor(props) {
        super(props);
    this.state = {
            // TODO: tempVar is just to update user of completeness of items (should use objects to return promise notifications)
            "tempVar" : "Guest!",      
            "playlist_id":"4GC3oUR910gclPtJUpReY9",

    };
}
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={{backgroundColor : "#1D1C17", height:"100%"}}>
                
                <View style={{height : '75%', marginBottom : 5, marginTop : 20}}>
                    <ShowPlaylists
                        hosted = {false}
                        navigation={this.props.navigation}
                    />
                </View>
                <View style={{alignItems : 'center', height : '20%', width : '100%'}}>
                    <CreatePlaylistButton 
                        buttonText = {"Join Playlist"}
                        onPress = {() => navigate('QrCodePage')}
                        textStyle = {{
                            color:'white',
                            fontWeight: 'bold',
                            fontSize: 30,
                    
                        }}
                    />
                </View>
            </View>
        );
    }

        // This feature was moved to joinerPlaylistUI page but left here just in case (it is not callable from UI now)
        _followPlaylist = async () => {
            
                    const sp = await getValidSPObj();
                    //const { id: userId } = await sp.getMe(); 
                    //37i9dQZF1DXcF6B6QPhFDv
                    try {
                        await sp.followPlaylist(this.state.playlist_id);
                        
                                this.setState({
                                    "tempVar": "you just followed a playlist created by a Sharify user."
                                }, () => {
                                });
                    } catch (e) {
                        
                        console.log(e)
                    }
                    
                    
        };

        // Note: Playback must be active and suspended on a device for this call to be functional
        _resumePlayback = async () => {
            
                    const sp = await getValidSPObj();
                    const { id: userId } = await sp.getMe(); 
                    
                    sp.play()
                    
                            this.setState({
                                "tempVar": "resuming Playback on Active Device."
                            }, () => {
                            });
                    
        };
            
}