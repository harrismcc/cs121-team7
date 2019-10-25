import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    spotifyAuthButton: {
        height: 50, 
        width: 200,
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
        color: "#FFF",
        marginTop: 120,
        width: 180,
        textAlign: 'center',
        opacity: 0.9
    }
  });