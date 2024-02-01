import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './scr/App';
import './scr/handle/TelemetryDeck/globals'

AppRegistry.registerComponent(appName, () => App);
