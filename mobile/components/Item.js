import React from 'react';
import {Text} from 'react-native';


class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: this.props.itemName,
      itemPrice: this.props.itemPrice,
    };


    render(){
      return(
        <Text> {this.props.itemName} </Text>
      );
    }
  }
}
