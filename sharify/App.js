//pagination
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

//must be installed
import { AsyncStorage } from 'react-native';
import { AuthorizeWithSpotify } from "./spotifyAuth.js";
import { ShowPlaylists } from './pages/showPlaylistsPage.js'
import { LoginFormPage } from "./pages/loginPage.js"

//exporting one thing by default so don't use {}
import PlaySong from "./pages/playSong.js"

//CLEAR ON EACH RUN FOR DEBUGGING
//TODO: Delete this AsyncStorage clear
AsyncStorage.clear().then(console.log("DELETED"))


//Init navigator and add pages
const MainNavigator = createStackNavigator({
  Home: {screen: ShowPlaylists},
  SpotifyAuth: {screen: AuthorizeWithSpotify},
  LoginPage: {screen: LoginFormPage},
  MusicPage: {screen: PlaySong}
});

//create app from navigator
const App = createAppContainer(MainNavigator);

//export app object
export default App;





