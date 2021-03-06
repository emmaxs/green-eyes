import React, { Component } from 'react';
import Expo from 'expo';
import HomeScreen from './screens/HomeScreen.js';
export default class App extends Component {
	constructor() {
		super();
		this.state = {
			isReady: false,
		};
	}
	async componentWillMount() {
		/* in case we have fonts later */
		// await Expo.Font.loadAsync({
		//   Roboto: require("native-base/Fonts/Roboto.ttf"),
		//   Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
		//   Ionicons: require("native-base/Fonts/Ionicons.ttf")
		// });
		this.setState({ isReady: true });
	}
	render() {
		if (!this.state.isReady) {
			return <Expo.AppLoading />;
		}
		return <HomeScreen />;
	}
}
