import React, { Component } from 'react';
import { View, Button, Text, ScrollView, AsyncStorage } from 'react-native';
import firebase from 'firebase';
import { styles } from '../stylesheet.js'
import { createNewPlaylist, getValidSPObj, getUserTopPlaylists, getUserTopTracks, testRec } from "../spotifyAuth.js";

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
            "playlist_id":"4GC3oUR910gclPtJUpReY9",
            "playlist_id2":"37i9dQZF1DX0IlCGIUGBsA",

            // Note: these must be URIs not just the songIDs
            "song1ToAdd":"spotify:track:29vPsCpO1i4DN2V5F9MSWi",
            "song2ToAdd":"spotify:track:0bjyNIHEPUEXGYFUoYqJni", 

            // Maximum number of contributions per member contributing to basic version of playlist generation 
            // Recommended: Playlist for enjoying old songs and playlist designed for discovering new music
            // Note: Must be 50 or less
            maxContributions : 5,

            // For calculations in favorite songs, what time period do we want to base off of? 
            // Options: long_term (several years), medium_term (last 6 months), short_term (last 4 weeks)
            // Note: We should have a slider for users to decide
            timeRange : "medium_term"

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
            <Button title="Create a Playlist" onPress={this._generatePlaylist}/>
            </View>
            <View style={[{margin: 5}]}>
            <Button title="Add Defined Songs to a Playlist" onPress={this._addToPlaylists}/>
            </View>
            <View style={[{margin: 5}]}>
            <Button title="Contribute Your Favorites to Playlist" onPress={this._addTopTracksToPlaylists}/>
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

    // This feature was moved to joinerPlaylistUI page but left here just in case (it is not callable from UI now)
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
        
        sp.addTracksToPlaylist(this.state.playlist_id, songsParsed);
        
        this.setState({
            "tempVar": "Your favorite songs have been added to the collab playlist.",
        }, () => {
        });
    
    }
}



