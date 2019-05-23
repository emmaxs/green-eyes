import React, { Component } from 'react';
import { Image } from 'react-native';
import {
	Container,
	Header,
	View,
	DeckSwiper,
	Card,
	CardItem,
	Thumbnail,
	Text,
	Left,
	Body,
	Accordion,
} from 'native-base';
const cards = [
	{
		text: 'Card One',
		name: 'One',
		image: require('../assets/icon.png'),
	},
	{
		text: 'Card Two',
		name: 'Two',
		image: require('../assets/icon.png'),
	},
	{
		text: 'Card Three',
		name: 'Three',
		image: require('../assets/icon.png'),
	},
];

const dataArray = [{ title: 'First Element', content: 'Lorem ipsum dolor sit amet' }];

export default class DeckSwiperExample extends Component {
	render() {
		return (
			<Container>
				<Header />
				<View>
					<DeckSwiper
						dataSource={cards}
						renderItem={item => (
							<Card style={{ elevation: 3 }}>
								<CardItem>
									<Left>
										<Thumbnail source={item.image} />
										<Body>
											<Text>{item.text}</Text>
											<Text note>NativeBase</Text>
										</Body>
									</Left>
								</CardItem>
								<CardItem cardBody>
									<Image style={{ height: 300, flex: 1 }} source={item.image} />
								</CardItem>
								<CardItem>
									<Accordion dataArray={dataArray} icon="add" expandedIcon="remove" />
								</CardItem>
							</Card>
						)}
					/>
				</View>
			</Container>
		);
	}
}
