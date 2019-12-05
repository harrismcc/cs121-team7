import React from 'react';
import { Text, Button, View, StyleSheet} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import {joinAsGuest} from '../firebaseHelper.js'

export class QrCodeReader extends React.Component {
    static navigationOptions = {
      title: 'Qr Code Join',
      headerStyle: {
        backgroundColor : '#070600',
        //backgroundColor : '#FCA311',
        
      },
      headerTintColor : 'white'
    };
    
    async componentDidMount() {
        this.getPermissionsAsync();
    }
  
   constructor(props) {
    super(props);
     
    //set default state
    this.state = {
      scanned : false,
      hasCameraPermission : null
    };
   }
    
    render() {
        const { hasCameraPermission, scanned } = this.state;

        if(hasCameraPermission == null){
            this.getPermissionsAsync();
        }

        if (hasCameraPermission == "granted"){
            const {navigate} = this.props.navigation;
            return(
                <View
                style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
                backgroundColor : "#1D1C17"
                }}>
                    <View style={{width: '100%', height: '100%'}}>
                    <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : this.onSuccess}
                    style={StyleSheet.absoluteFillObject}
                    />
                    </View>

                
                    {scanned && (
                    <Button title={'Tap to Scan Again'} onPress={() => this.setState({ scanned: false })} />
                    )}
                </View>
            )
        } else {
            return(
            <Text>Looks like you didn't grant camera permissions</Text>
            )
        }
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status });
    };

    onSuccess = ({ type, data }) => {
        pure = data.replace("sharify://", "");

        if (data != pure){
            joinAsGuest(pure).then((playlist) => {console.log(JSON.stringify(playlist));});
            alert(`${data} has been scanned and joined!`);
            this.setState({scanned : true})
        }else{
            alert(`${data} is not a valid sharify code, try again`)
            this.setState({scanned : true})
        }
    }

}