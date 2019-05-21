import React from 'react';
import {Text, View, Image} from 'react-native';


export default class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: this.props.itemName,
      itemPrice: this.props.itemPrice,
      //itemLink: this.props.itemLink, TODO
      itemPhoto: this.props.itemPhoto,
    };
  }

    render(){
      return(
        <View>
          <Text>{this.props.itemName}</Text>
          <Image style={{width: 200, height: 200}}
          source={{uri: this.props.itemPhoto}}/>
          <Text>{this.props.itemPrice}</Text>
        </View>
      );

  }
}
