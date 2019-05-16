import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import { Constants, ImagePicker, Permissions } from 'expo';

export default class App extends React.Component {
	state = {
		photo: null,
	};

	handleURL = () => {
		fetch('http://localhost:3000/api/url', {
			method: 'POST',
			body: JSON.stringify({
				url: 'https://watson-developer-cloud.github.io/doc-tutorial-downloads/visual-recognition/fruitbowl.jpg',
			}), // data can be `string` or {object}!
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(response => {
				console.log('url submit succes', response);
				alert('url submit success!');
			})
			.catch(error => {
				console.log('url error', error);
				alert('Url failed!');
			});
	};

	handleUpload = () => {
		fetch('http://localhost:3000/api/upload', {
			method: 'POST',
			body: createFormData(this.state.photo, { userId: '123' }),
		})
			.then(response => response.json())
			.then(response => {
				console.log('upload succes', response);
				alert('Upload success!');
				this.setState({ photo: null });
			})
			.catch(error => {
				console.log('upload error', error);
				alert('Upload failed!');
			});
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

	render() {
		const { photo } = this.state;
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				{photo && (
					<React.Fragment>
						<Image source={{ uri: photo.uri }} style={{ width: 300, height: 300 }} />
						<Button title="Upload" onPress={this.handleUpload} />
					</React.Fragment>
				)}
				<Button title="Choose Photo" onPress={this.handleChoosePhoto} />
				<Button title="Test URL" onPress={this.handleURL} />
			</View>
		);
	}
}

const createFormData = (photo, body) => {
	let uriParts = photo.uri.split('.');
	let fileType = uriParts[uriParts.length - 1];

	let formData = new FormData();
	formData.append('photo', {
		name: photo.fileName,
		type: fileType,
		uri: photo.uri,
	});

	Object.keys(body).forEach(key => {
		formData.append(key, body[key]);
	});

	return formData;
};
