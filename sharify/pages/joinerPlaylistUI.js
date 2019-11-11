import React, { Component } from 'react';
import { View, Button, Text, ScrollView, AsyncStorage } from 'react-native';
import firebase from 'firebase';
import {styles} from '../stylesheet.js'
import { getValidSPObj } from "../spotifyAuth.js";


export default class joinerPage extends Component {
    static navigationOptions = {
        title: 'Join Page',
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
        return (
            <View style = {{ flex: 1, justifyContent: "center",
            alignItems: "center"}}>
            <Text>Welcome, {this.state.tempVar} </Text>
            <View style={[{margin: 5}]}>
            <Button title="Follow a Playlist" onPress={this._followPlaylist}/>
            </View>
            <View style={[{margin: 5}]}>
            <Button title="Resume Playback on Active Device" onPress={this._resumePlayback}/>
            </View>
            </View>
            
        );
    }

        // This feature was moved to joinerPlaylistUI page but left here just in case (it is not callable from UI now)
        _followPlaylist = async () => {
            
                    const sp = await getValidSPObj();
                    const { id: userId } = await sp.getMe(); 
                    
                    sp.followPlaylist(this.state.playlist_id, {public:false});
                    
                            this.setState({
                                "tempVar": "you just followed a playlist created by a Sharify user."
                            }, () => {
                            });
                    
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