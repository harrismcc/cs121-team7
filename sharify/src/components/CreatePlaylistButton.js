import React, { Component } from 'react';
import { View, Modal, Text, TextInput, StyleSheet, TouchableHighlight } from 'react-native';


export default class CreatePlaylistButton extends Component{
    constructor(props){
        super(props)
        this.state = {
            modalVis : false
        }

        this.onPress = this.props.onPress.bind(this);
    }
    render(){
        
        return(
            <View style={{width : '100%', alignItems : 'center', justifyContent : 'center'}}>
                <CreatePlaylistModal 
                    visible = {this.state.modalVis}
                />
                <TouchableHighlight
                    style = {stylesCreatePlaylistButton.buttonBackground}
                    onPress={this.props.onPress}
                >
                    <View style={{justifyContent : 'center', alignItems : 'center'}}>
                        <Text style={this.props.textStyle}>
                            {this.props.buttonText}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}
CreatePlaylistButton.defaultProps = {
    onPress : {},
    buttonText : "Create Playlist"

}


class CreatePlaylistModal extends Component{
    constructor(props){
        super(props)
        this.state = {
            isVis : this.props.visible
        }
    }

    render(){
        return(
            <Modal 
                transparent = {false}
                style={{width : 20, height : 20}}
                visible = {this.props.visible}
            >
                <TextInput></TextInput>
            </Modal>
        )
    }
}
CreatePlaylistModal.defaultProps = {
    visible : false,
    textStyle :  {
        color:'white',
        fontWeight: 'bold',
        fontSize: 30,

    }
}

const stylesCreatePlaylistButton = StyleSheet.create({
    buttonBackground : {
        margin : 10,
        width : '80%',
        height : 75,
        backgroundColor : '#59C9A5',
        borderRadius : 50,
        justifyContent: 'center',
        alignItems : 'center',
    },
    titleText : {
        color:'white',
        fontWeight: 'bold',
        fontSize: 30,

    }
})