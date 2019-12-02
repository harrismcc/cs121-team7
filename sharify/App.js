//pagination
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

//must be installed
import { AsyncStorage } from 'react-native';
import { AuthorizeWithSpotify } from "./spotifyAuth.js";
import { ShowPlaylists } from './pages/showPlaylistsPage.js'
import { LoginFormPage } from "./pages/loginPage.js"
import { RecsPage } from "./pages/recsTestPage.js"
import { QrCodeReader } from "./pages/qrCodeReader.js"

//exporting one thing by default so don't use {}
import PlaySong from "./pages/playSong.js"
import HostPage from "./pages/hostPlaylistUI.js"
import JoinPage from "./pages/joinerPlaylistUI.js"




//Init navigator and add pages
const MainNavigator = createStackNavigator({
  Home: {screen: ShowPlaylists},
  SpotifyAuth: {screen: AuthorizeWithSpotify},
  LoginPage: {screen: LoginFormPage},
  MusicPage: {screen: PlaySong},
  RecsPage : {screen: RecsPage},
  JoinPage : {screen: JoinPage},
  HostPage : {screen: HostPage},
  QrCodePage : {screen: QrCodeReader}
});

//create app from navigator
const App = createAppContainer(MainNavigator);

//export app object
export default App;





