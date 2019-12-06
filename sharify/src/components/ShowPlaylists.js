import React, { Component } from 'react';
import { View, Image, Text, ScrollView, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import {getPlaylistFromId, getPlaylistImageURL, getValueFromUserInDatabase, createNewUserInDatabase, getCurrentUser} from "../../firebaseHelper.js"


export default class ShowPlaylists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topMargin : 45,
            title : "My Hosted Playlists",
            test : "abc",
            hostingList : []
        }
        1
        console.disableYellowBox = true;
        
    }

    componentDidMount() {
        createNewUserInDatabase(getCurrentUser()); //make sure user is setup

        if (this.props.hosted){
            this._getUsersHostedPlaylists()
            this.setState({title : "My Hosted Playlists"})
        }

        else{
            this._getUsersGuestPlaylists()
            this.setState({title : "My Joined Playlists"})
        }

        this.timer = setInterval(()=> this._getUsersHostedPlaylists(), 5000)//5 seconds
        
    }
    

    render(){
        return(
            <View style={stylesShowPlaylist.container}>
                <Text style={stylesShowPlaylist.titleText}>{this.state.title}</Text>
                <ScrollView>
                    {this._mapAllHostedLists()}
                </ScrollView>
            </View>
        )
    }


    _getUsersHostedPlaylists = async() => {
        hostList = await getValueFromUserInDatabase()
        if(hostList != this.state.hostingList && hostList){
            this.setState({hostingList : hostList["hosting"]})
        }
        

    }

    _getUsersGuestPlaylists = async() => {
        hostList = await getValueFromUserInDatabase()
        if (hostList && hostList != this.state.hostingList){
            this.setState({hostingList : hostList["guest"]})
        }
        

    }

    _mapAllHostedLists = () => {
        key = 0
        if (!(this.state.hostingList == [] || this.state.hostingList == undefined || this.state.hostingList == null)){
            return this.state.hostingList.map(playlist => {
                key += 1
                return(
                    <SinglePlaylist
                            navigation={this.props.navigation}
                            playlistId = {playlist}
                            key = {key}
                    />
                )
            })
        }
    }
}
ShowPlaylists.defaultProps  = {
    hosted : true
}


export class SinglePlaylist extends Component {
    constructor(props) {
        //console.disableYellowBox = true //TODO: DELETE THIS OMG
        super(props);
        this.state = {
            playlistObject : {
                playlistSpotifyName : "",
                playlistDescription : ""
            },
            coverImage : "",
            playlistIsLoaded: false,
            imageIsLoaded : false,
            playlistId : "", 
        }
        
        
    }
    componentDidMount(){
       
        this._storePlaylistInfoInState()
        this.timer = setInterval(()=> this._storePlaylistInfoInState(), 5000)//5 seconds
        //TODO: this refreshed the names but not new items?
        
        
        
        
    }
    

    render(){
        if(this.state.playlistIsLoaded && this.state.imageIsLoaded){ //this prevents all the parts from appearing one by one on the screen
            return(
                <View>
                <TouchableHighlight onPress={this._onPressButton} onLongPress={this._onLongPressButton} underlayColor="white">
                <View style={stylesSinglePlaylist.container}>
                    
                    
                        <View style={stylesSinglePlaylist.coverImage}>
                            {this._renderCoverImage()}
                            
                        </View>
                        <View>
                            <Text 
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={stylesSinglePlaylist.titleText}
                            >
                                {this.state.playlistObject.playlistSpotifyName}
                            </Text>

                            <Text numberOfLines={2} style={stylesSinglePlaylist.descText}>{this.state.playlistObject.playlistDescription}</Text>
                        </View>
                    
                        
                </View>
                
                </TouchableHighlight>
                
                </View>
                
            )
        }else{
            return(
                <View style={stylesSinglePlaylist.container}></View>
            )
        }
    }

    _storePlaylistInfoInState = () => {
        

            //Non-async version of this code:
            if (this.props.playlistId){

                getPlaylistFromId(this.props.playlistId).then((playlist) => {
                    if (playlist != this.state.playlistObject){
                        this.setState({playlistObject : playlist})
                        this.setState({playlistIsLoaded : true})
                    }
                    
                }).catch(err => {
                    console.error("Error while setting playlist object in SinglePlaylist" + err)
                })
                
                getPlaylistImageURL(this.props.playlistId).then((imageUrl) => {
                    if (imageUrl != this.state.coverImage){
                        this.setState({coverImage : imageUrl})
                        this.setState({imageIsLoaded : true})
                    }
                    
                    
                }).catch(err => {
                    console.error("Error while setting cover image in SinglePlaylist" + err)
                })

                this.setState({playlistId : this.props.playlistId})

        }

        
    }

    _renderCoverImage = () => {
        //TODO: Strange Error here where images are cross-contaminating
        if(this.state.imageIsLoaded){
            return(
                <Image 
                    source={{uri : this.state.coverImage}}
                    style={{width: 60, height: 60}}
                />
            )
        }else{
            return(
                <Image 
                    source={{uri : "https://images.rapgenius.com/0bfa0730f0f4251355f6311af8961917.1000x1000x1.jpg"}}
                    style={{width: 60, height: 60}}
                />
            )
        }
    }

    _onPressButton = () => {

        this.props.navigation.navigate('DisplaySinglePlaylistPage', {"playlistId" : this.state.playlistId});
    }

    _onLongPressButton = () => {
        
        Alert.alert(
            'Edit?',
            'Would you like to edit or delete this playlist?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                  text: "Delete",
                  onPress: () => this._deleteAlert()
                },
              {text: 'Yes', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
    }

    _deleteAlert = () => {
        Alert.alert(
            'Remove?',
            'Are you sure you would like to remove this playlist?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Yes', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
    }


}

SinglePlaylist.defaultProps = {
    playlistId : ""
}




const stylesSinglePlaylist = StyleSheet.create({
    container: {
        flexDirection: "row",
        width : '100%',
        height : 75,
        margin : 5
    },
    coverImage: {
        justifyContent: 'center',
        marginLeft:5,
        marginRight: 5,
    },
    titleText : {
        color:'white',
        fontWeight: 'bold',
        fontSize: 20,
        width : '100%',
    },
    descText : {
        color:'white',
        fontSize: 12,
    },
    horizontalLine : {
        width : '80%',
        height : 2,
        justifyContent: 'center',
        marginLeft : 'auto',
        marginRight : 'auto',
        opacity : 100,
    }
    


});


const stylesShowPlaylist = StyleSheet.create({
    container: {
        width : '100%',
        height : '100%',
        backgroundColor : "#1D1C17",
    },
    titleText : {
        marginLeft : 5,
        color:'white',
        fontWeight: 'bold',
        fontSize: 50,
    },

});

