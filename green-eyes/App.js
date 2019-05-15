import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import { Constants, ImagePicker, Permissions } from 'expo';

export default class App extends React.Component {
	state = {
		photo: null,
	};

	handleUpload = () => {
		fetch('http://localhost:3000/api/upload', {
			method: 'POST',
			body: createFormData(this.state.photo),
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
			</View>
		);
	}
}

const createFormData = photo => {
	// const data = new FormData();

	// data.append('photo', {
	// 	name: photo.fileName,
	// 	type: photo.type,
	// 	uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
	// });

	let uriParts = photo.uri.split('.');
	let fileType = uriParts[uriParts.length - 1];

	let formData = new FormData();
	formData.append('photo', {
		name: photo.fileName,
		type: fileType,
		uri: photo.uri,
	});

	// let options = {
	// 	method: 'POST',
	// 	body: formData,
	// 	headers: {
	// 		Accept: 'application/json',
	// 		'Content-Type': 'multipart/form-data',
	// 	},
	// };

	// return fetch(apiUrl, options);

	// return data;
	return formData;
};
