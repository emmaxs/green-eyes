import React from 'react';
import {
  Text, View, Image, Button, Modal, WebView,
} from 'react-native';


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
        <Image style={{ width: 200, height: 200 }}
          source={{ uri: this.props.itemPhoto }}
        />
        <Text>{this.props.itemName}</Text>
        <Text>{this.props.itemPrice}</Text>
        <Button
          onPress={this.triggerModal}
          title="Buy item"
          color="#841584"
          accessibilityLabel="Buy item"
        />
        {this.state.modalOn && (
        <Modal
          animationType="slide"
          visible={this.state.modalOn}
          onRequestClose={() => {
            this.setState((state, props) => ({ modalOn: false }));
          }}
        >
          <WebView
            source={{ uri: this.props.itemLink }}
            style={{ marginTop: 100 }}
          />
          <Button
            onPress={this.triggerModal}
            title="Close window"
            color="#841584"
            accessibilityLabel="close window"
          />
        </Modal>
        )}

      </View>
    );
  }
}
