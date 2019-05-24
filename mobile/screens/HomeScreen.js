import React from 'react';
import { View, Text, Image } from 'react-native';
import { Root, ActionSheet, Container, Header, Title, Button, Left, Right, Body, Icon, Content } from 'native-base';
import { ImagePicker, Permissions } from 'expo';
import DeckSwiperExample from '../components/DeckSwiper';
import SearchScreen from './SearchScreen';

var BUTTONS = ['Take Photo', 'Upload From Camera Roll', 'Go Back'];
var CANCEL_INDEX = 2;

export default class App extends React.Component {
	state = {
		photo: null,
		clothing: null,
	};

	/* we are currently not using this */
	// handleURL = () => {
	// 	fetch('http://localhost:3000/api/url', {
	// 		method: 'POST',
	// 		body: JSON.stringify({
	// 			url: 'https://watson-developer-cloud.github.io/doc-tutorial-downloads/visual-recognition/fruitbowl.jpg',
	// 		}), // data can be `string` or {object}!
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 	})
	// 		.then(response => response.json())
	// 		.then(response => {
	// 			console.log('url submit succes', response);
	// 			alert('url submit success!');
	// 		})
	// 		.catch(error => {
	// 			console.log('url error', error);
	// 			alert('Url failed!');
	// 		});
	// };

	handleUpload = () => {
		fetch('http://localhost:3000/api/upload', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
			},
			body: createFormData(this.state.photo),
		})
			.then(response => response.json())
			.then(response => {
				console.log(response);
				/* for multiple keywords, do an array/selector possibly in new funct */
				var keyword = response.data;
				this.setState({ clothing: keyword });
				// alert
				console.log('upload success', response.message);
				alert('Upload success!');
			})
			.catch(error => {
				console.log('upload error', error);
				alert('Upload failed!');
			});
	};

	handleTakePhoto = async () => {
		const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);

		const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

		// only if user allows permission to camera AND camera roll
		if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
			let pickerResult = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [4, 3],
			});
			if (pickerResult.uri) {
				this.setState({ photo: pickerResult });
			}
		}
	};

	handleChoosePhoto = async () => {
		const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

		// only if user allows permission to camera roll
		if (cameraRollPerm === 'granted') {
			let pickerResult = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [4, 3],
			});
			if (pickerResult.uri) {
				this.setState({ photo: pickerResult });
			}
		}
	};

	/* summon the upload button */
	uploadButton = () => {
		ActionSheet.show(
			{
				options: BUTTONS,
				cancelButtonIndex: CANCEL_INDEX,
				title: 'Upload a Photo',
			},
			buttonIndex => {
				/* consider adding types right now */
				if (buttonIndex === 0) {
					this.handleTakePhoto();
				}
				if (buttonIndex === 1) {
					this.handleChoosePhoto();
				}
			}
		);
	};

	render() {
		return (
			// probably bad practice to have root here
			<Root>
				<Container>
					<Header>
						<Left />
						<Body>
							<Title>Green Eyes</Title>
						</Body>
						<Right>
							<Button transparent onPress={this.uploadButton}>
								<Icon name="camera" />
							</Button>
						</Right>
					</Header>
					<Content padder>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							{this.state.photo ? (
								/* make this it's own component */
								<React.Fragment>
									<Image source={{ uri: this.state.photo.uri }} style={{ width: 300, height: 300 }} />
									{/* add a spacer */}
									<Button iconLeft block info onPress={this.handleUpload}>
										<Text>Find me an Outfit</Text>
										<Icon name="shirt" />
									</Button>
								</React.Fragment>
							) : (
								<Button iconLeft block info onPress={this.uploadButton}>
									<Text>Upload a Picture</Text>
									<Icon name="camera" />
								</Button>
							)}
							{this.state.clothing && <Text> We have found {this.state.clothing} in this picture. </Text>}
						</View>
						{/* pass a prop through for the search */}
						<SearchScreen />
						{/* <DeckSwiperExample /> */}
					</Content>
				</Container>
			</Root>
		);
	}
}

const createFormData = photo => {
	let uri = photo.uri;
	let uriParts = uri.split('.');
	let fileType = uriParts[uriParts.length - 1];

	let formData = new FormData();
	formData.append('photo', {
		uri,
		name: `photo.${fileType}`,
		type: `image/${fileType}`,
	});
	return formData;
};
