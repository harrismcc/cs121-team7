import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#555555',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0, 
    },
    submitButton: {
        position: 'absolute',
        bottom:550,
        right:20,
        backgroundColor: '#656565', 
    },
    hostButton: {
        position: 'absolute',
        bottom:160,
        alignItems: 'center',
    },
    joinButton: {
        position: 'absolute',
        bottom:160,
        right:75,
    },
    buttonImage: {
        flex: 1,
        backgroundColor: '#555555',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0, 
        height: 200, 
        width : 200,
        marginTop : 40 
      },
      buttonImage2: {
        flex: 1,
        backgroundColor: '#555555',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0, 
        height: 200, 
        width : 200,
      },
    labeledSlider: {
        flex: 1,
        maxHeight:25,
        flexDirection: "row",
        backgroundColor: '#339900',
        alignItems: 'center',
        justifyContent: 'center',

    },
    spotifyAuthButton: {
        height: 75, 
        width: 280,
        marginBottom: 10, 
        backgroundColor: '#474747', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 15,
        flexDirection:"row",
    },
    logo: {
        position: 'absolute',
        width: 300,
        height: 100
    },
    title:{
        color: "#339900",
        marginTop: 120,
        width: 180,
        textAlign: 'center',
        opacity: 0.9
    },
    songDisplayRowItem: {
        minWidth: '90%', 
        maxWidth: '90%', 
        borderColor: 'black',
        backgroundColor: 'grey', 
        marginBottom: 2,
        borderWidth: 2, 
        borderRadius: 5
    },
    mainButton: {
            height: 250, 
            width: 250,
            marginBottom: 10, 
            backgroundColor: '#474747', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: 15,
            flexDirection:"row",
    }
  });
// Futura