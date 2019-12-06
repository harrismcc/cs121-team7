import React, { Component} from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import{createAsHost} from "../firebaseHelper.js"
import QRCode from 'react-native-qrcode-svg';

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
            newId : "kHaj8ahfg3ak",
            nameTextBox : null,
            descTextBox : null,
            page : "namePage"
        }
        

    }

    render(){
        if (this.state.page == "namePage"){
            return this._getNamePage()
        }else{
            return this._getAddUserPage()
        }
        
    }

    _onChangeName = (text) => {
        this.setState({nameTextBox : text})
    }
    _onChangeDesc = (text) => {
        this.setState({descTextBox : text})
    }

    _nextButtonPressed = () => {
        alert("Next Button Pressed")
        this._generatePlaylist()
        this.setState({page : "addPeople"})
    }

    _generatePlaylist = async () => {
        //TODO: Does commenting this line mean that playlist aren't created?
        //createNewPlaylist(this.state.name, this.state.description, this.state.isPublic)
        newId = await createAsHost(this.state.nameTextBox, this.state.descTextBox, this.state.isPublic)

        alert("Playlist " + this.state.nameTextBox + " created!")

        this.setState({newId : newId})
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
        return (
            <View style={styles.container}>
                <Text style={styles.mainText}>
                    {this.state.newId}
                </Text>
                <QRCode
                //QR code value
                value={"sharify://" + this.state.newId}
                size={250}
                color="#1D1C17"
                backgroundColor="white"
                logo={{
                    url:
                    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/logosmalltransparen.png',
                }}
                logoSize={30}
                logoMargin={2}
                logoBorderRadius={15}
                logoBackgroundColor="yellow"
                />
            </View>
        )
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