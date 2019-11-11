import React, { Component } from 'react';
import { View, Button, Text } from 'react-native';
import firebase from 'firebase';
import { styles } from '../stylesheet.js'
import { createNewPlaylist, getValidSPObj } from "../spotifyAuth.js";

export default class hostPage extends Component {
    static navigationOptions = {
        title: 'Host Page',
      };

    constructor(props) {
    super(props);

    //set default state for collaborative playlists
    this.state = {
            // TODO: tempVar is just to update user of completeness of items (should use objects to return promise notifications)
            "tempVar" : "Hey, user!",
            "name" : "Sharify's Auto-Generated Playlist",
            "description" : "Let's go team!",
            
            // Note: isPublic must be set to false for collaborative to work
            "isPublic":false,
            "isCollab":true,

            playlist_id:"4GC3oUR910gclPtJUpReY9"
         }
}

    render() {
        return (
            <View style = {{ flex: 1, justifyContent: "center",
            alignItems: "center"}}>
            <Text>{this.state.tempVar}</Text>
            <Button title="Grab User Data for Items Below (optional)" onPress={this._getUserData} />
            <View style={[{margin: 5}]}>
            <Button title="Resume Playback on Active Device" onPress={this._resumePlayback}/>
            </View>
            <View style={[{margin: 5}]}>
            <Button title="Follow a Playlist" onPress={this._followPlaylist}/>
            </View>
            <View style={[{margin: 5}]}>
            <Button title="Create a Playlist" onPress={this._generatePlaylist}/>
            </View>
            </View>
        );
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

    _followPlaylist = async () => {

        const sp = await getValidSPObj();
        const { id: userId } = await sp.getMe(); 
        
        sp.followPlaylist(this.state.playlist_id, {public:false});
        
                this.setState({
                    "tempVar": "You just followed a playlist created by a Sharify user."
                }, () => {
                });
        
            };

    _generatePlaylist = async () => {

        const sp = await getValidSPObj();
        const { id: userId } = await sp.getMe(); 

        
        sp.createPlaylist(userId, {"name" : this.state.name, "public" : this.state.isPublic, "collaborative" : this.state.isCollab, "description" : this.state.description});
        
                this.setState({
                    "tempVar": "You just created a collaborative playlist."
                }, () => {
                });
        
            };


            
}



