import React, { Component} from 'react';
import { View, TextInput, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import{createAsHost, getGuestList} from "../firebaseHelper.js"
import ReactDOM from 'react-dom';
import firebase from 'firebase'


import CreatePlaylistButton from "../src/components/CreatePlaylistButton.js"



export default class CreatePage extends Component {
    static navigationOptions = {
        title: 'Create New',
        headerStyle: {
            backgroundColor : '#070600',
            //backgroundColor : '#FCA311',
            
          },
          headerTintColor : 'white'
      };

    constructor(props){
        super(props)
        this.state = {
            isPublic : 'false',
            newId : null,
            nameTextBox : null,
            descTextBox : null,
            page : "namePage",
            guestList : []
        }
        
    console.disableYellowBox = true;

    };
    componentDidMount(){
        this._refreshGuestList()
        this.timer = setInterval(()=> this._refreshGuestList(), 1000)//5 seconds
    }

    render(){
        if (this.state.page == "namePage"){
            return this._getNamePage()
        }else{
            return this._getAddUserPage()
        }
        
    };

    _onChangeName = (text) => {
        this.setState({nameTextBox : text})
    }
    _onChangeDesc = (text) => {
        this.setState({descTextBox : text})
    }

    _nextButtonPressed = () => {
        this._generatePlaylist()
        this.setState({page : "addPeople"})
    }

    _generatePlaylist = async () => {
        //TODO: Does commenting this line mean that playlist aren't created?
        //createNewPlaylist(this.state.name, this.state.description, this.state.isPublic)
        newId = await createAsHost(this.state.nameTextBox, this.state.descTextBox, this.state.isPublic)
      

        this.setState({newId : newId})
        this._refreshGuestList()
        
    };


    _getNamePage = () => {
        return(
            <View style={styles.container}>
                <View>
                    <Text style={styles.titleText}>Create New Playlist</Text>
                </View>
                <View style={styles.inputBox}>
                    <Text style={styles.mainText}>Name: </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this._onChangeName(text)}
                        value={this.state.nameTextBox}
                    />
                </View>
                <View style={styles.inputBox}>
                    <Text style={styles.mainText}>Description: </Text>
                    <TextInput
                        style={styles.textInput}
                        multiline={true}
                        onChangeText={text => this._onChangeDesc(text)}
                        value={this.state.descTextBox}
                    />
                </View>
                <View>
                    <CreatePlaylistButton
                        buttonText = {"Next"}
                        onPress = {this._nextButtonPressed}
                        textStyle = {{
                            color:'white',
                            fontWeight: 'bold',
                            fontSize: 30,
                    
                        }}
                    />
                </View>
            </View>
            
        )
    }

    _getAddUserPage = () => {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                    <Text style={styles.titleText}>
                        Add Your Friends!
                    </Text>
                    <Image
                        source={{uri : "https://qrickit.com/api/qr.php?qrsize=300&&fgcolor=1D1C17&bgdcolor=59C9A5&d=sharify%3A%2F%2F" + this.state.newId}}
                        style={{width:200,height:200}}
                    
                    />
                </View>
                <View>
                <Text style={styles.mainText}>Currently Joined:</Text>
                <ScrollView style={{height : '30%'}}>
                    <FlatList
                        data = {this.state.guestList}
                        renderItem={({item}) => <Text style={styles.mainText}>{item}</Text>}
                    />
                </ScrollView>
                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                    <CreatePlaylistButton
                        buttonText = {"Done"}
                        onPress = {() => navigate('HostPage')}
                        textStyle = {{
                            color:'white',
                            fontWeight: 'bold',
                            fontSize: 30,
                    
                        }}
                    />
                </View>
                </View>
            </View>
        )
    }

    _refreshGuestList = () => {
        if(this.state.newId){
            require('firebase/firestore');
            const ref = firebase.firestore().collection("playlists").doc(this.state.newId);
            ref.get().then((doc) => {
                if (doc.exists && doc.data()["guests"] != this.state.guestList){
                    this.setState({guestList : doc.data()["guests"]})
                }
            })
        }
        
        
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor : "#1D1C17",
        width : '100%',
        height : '100%',
    },
    inputBox : {
        marginTop : 10,
        marginBottom : 10,
        alignItems : 'center',
        justifyContent : 'center',
        color:'white',
        fontWeight: 'bold',

    },
    textInput : { 
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1, 
        width:'80%' ,
        borderRadius : 10,
    },
    titleText : {
        marginTop : 10,
        marginLeft : 5,
        color:'white',
        fontWeight: 'bold',
        fontSize: 50,
    },
    mainText : {
        marginLeft : 15,
        marginBottom : 5,
        color:'white',
        fontWeight: 'bold',
        fontSize: 20,
        width : '100%',
    },

});