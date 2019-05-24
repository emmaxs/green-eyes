import React from 'react';
import { View, Modal, WebView, Image } from 'react-native';
import { Button, Text, Icon, Card, CardItem, Thumbnail, Left, Body } from 'native-base';

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
				<Card style={{ elevation: 3 }}>
					<CardItem>
						<Left>
							<Thumbnail source={{ uri: this.props.itemPhoto }} />
							<Body>
								<Text>{this.props.itemName}</Text>
								<Text note>{this.props.itemPrice}</Text>
							</Body>
						</Left>
					</CardItem>
					<CardItem cardBody>
						<Image style={{ height: 300, flex: 1 }} source={{ uri: this.props.itemPhoto }} />
					</CardItem>
				</Card>
				<Button iconRight block info onPress={this.triggerModal}>
					<Text> Buy '{this.props.itemName}' </Text>
					<Icon name="basket" />
				</Button>
				{/* WebView */}
				{this.state.modalOn && (
					<Modal
						animationType="slide"
						visible={this.state.modalOn}
						onRequestClose={() => {
							this.setState((state, props) => ({ modalOn: false }));
						}}
					>
						<Text> </Text>
						<Text> </Text>
						<Button iconRight transparent dark onPress={this.closeModal}>
							<Text>Close Window </Text>
							<Icon name="close-circle-outline" />
						</Button>
						<WebView source={{ uri: this.props.itemLink }} />
					</Modal>
				)}
			</View>
		);
	}
}
