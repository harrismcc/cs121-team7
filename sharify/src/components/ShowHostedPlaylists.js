import React, { Component } from 'react';
import { View, Image, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import {getPlaylistFromId, getPlaylistImageURL, getValueFromUserInDatabase} from "../../firebaseHelper.js"


export default class ShowHostedPlaylists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test : "abc",
            hostingList : []
        }
        
    }

    componentDidMount() {
        this._getUsersHostedPlaylists()
    }
    

    render(){
        return(
            <View style={stylesShowHostedPlaylist.container}>
                <Text style={stylesShowHostedPlaylist.titleText}>My Hosted Playlists</Text>
                <ScrollView>
                    {this._mapAllHostedLists()}
                </ScrollView>
            </View>
        )
    }


    _getUsersHostedPlaylists = async() => {
        hostList = await getValueFromUserInDatabase()
        this.setState({hostingList : hostList["hosting"]})

    }

    _mapAllHostedLists = () => {
        key = 0
        return this.state.hostingList.map(playlist => {
            key += 1
            return(
                <SinglePlaylist
                        playlistId = {playlist}
                        key = {key}
                />
            )
        })
    }
}
ShowHostedPlaylists.defaultProps  = {
    width: '100%',
    height: '100%'
}


class SinglePlaylist extends Component {
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
        }
        test = {}
        
        
    }
    componentDidMount(){
       
        this._storePlaylistInfoInState()
        
        
        
        
    }
    

    render(){
        if(this.state.playlistIsLoaded && this.state.imageIsLoaded){ //this prevents all the parts from appearing one by one on the screen
            return(
                <View style={stylesSinglePlaylist.container}>
                    <View style={stylesSinglePlaylist.coverImage}>
                        {this.test}
                        
                    </View>
                    <View>
                        <Text style={stylesSinglePlaylist.titleText}>{this.state.playlistObject.playlistSpotifyName}</Text>
                        <Text style={stylesSinglePlaylist.descText}>{this.state.playlistObject.playlistDescription}</Text>
                    </View>
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

            getPlaylistFromId(this.props.playlistId).then((playlist) => {
                this.setState({playlistObject : playlist})
                this.setState({playlistIsLoaded : true})
            }).catch(err => {
                console.error("Error while setting playlist object in SinglePlaylist" + err)
            })
            
            getPlaylistImageURL(this.props.playlistId).then((imageUrl) => {
                console.log("ABC")
                this.setState({coverImage : imageUrl})
                this.test = this._renderCoverImage(imageUrl)
                this.setState({imageIsLoaded : true})
                
            }).catch(err => {
                console.error("Error while setting cover image in SinglePlaylist" + err)
            })

            return true

        /*
        const playlistObject = await getPlaylistFromId(this.props.playlistId)
        this.setState({playlistObject : playlistObject})
        const imageUrl =  await getPlaylistImageURL(this.props.playlistId)
        this.setState({coverImage : imageUrl}) 
        this.setState({isLoaded: true }) //allow things to render
        */
        
    }

    _renderCoverImage = (imageurl) => {
        //TODO: Strange Error here where images are cross-contaminating
        if(true){
            return(
                <Image 
                    source={{uri : imageurl}}
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
}

SinglePlaylist.defaultProps = {
    playlistId : ""
}

const stylesSinglePlaylist = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#666",
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
    },
    descText : {
        color:'white',
        fontSize: 12,
    },
    


});


const stylesShowHostedPlaylist = StyleSheet.create({
    container: {
        backgroundColor: "#666",
        width : '100%',
        height : '100%',
        margin : 5
    },
    titleText : {
        color:'white',
        fontWeight: 'bold',
        fontSize: 30,
    },

});