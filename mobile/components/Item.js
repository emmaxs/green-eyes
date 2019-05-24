import React from 'react';
import { Text, View, Modal, WebView, Image } from 'react-native';
import { Button, Icon } from 'native-base';

export default class Item extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOn: false,
		};
		this.triggerModal = this.triggerModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	triggerModal() {
		this.setState((state, props) => ({ modalOn: !state.modalOn }));
	}

	closeModal() {
		this.setState({ modalOn: false });
	}

	render() {
		return (
			<View>
				<Image style={{ width: 200, height: 200 }} source={{ uri: this.props.itemPhoto }} />
				<Text>{this.props.itemName}</Text>
				<Text>{this.props.itemPrice}</Text>
				<Button iconLeft block info onPress={this.triggerModal}>
					<Text>View on Web</Text>
					<Icon name="information-circle" />
				</Button>
				{this.state.modalOn && (
					<Modal
						animationType="slide"
						visible={this.state.modalOn}
						onRequestClose={() => {
							this.setState((state, props) => ({ modalOn: false }));
						}}
					>
						<WebView source={{ uri: this.props.itemLink }} style={{ marginTop: 100 }} />
						<Button iconLeft block info onPress={this.closeModal}>
							<Text>Close Window</Text>
							<Icon name="close-circle-outline" />
						</Button>
					</Modal>
				)}
			</View>
		);
	}
}
