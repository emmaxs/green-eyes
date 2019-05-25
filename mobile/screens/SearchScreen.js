import React from 'react';
import { Text, View } from 'react-native';
import { Button, Icon, Spinner } from 'native-base';
import axios from 'axios';

import cheerio from 'react-native-cheerio';
import Item from '../components/Item';

export default class SearchScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchTerm: ['red', 'shoes'],
			threadUPLink: 'https://www.thredup.com/products/women?department_tags=women&sort=Relevance&text=red+shoes',
			resultItems: [],
			name_list: [],
			price_list: [],
			link_list: [],
			searchStarted: false,
			searchCompleted: false,
			photo_list: [],
		};

		this.renderResults = this.renderResults.bind(this);
		this.buildLinks = this.buildLinks.bind(this);
		this.readThreadUpPage = this.readThreadUpPage.bind(this);
		this.buildSearchResults = this.buildSearchResults.bind(this);
		this.render = this.render.bind(this);
	}

	renderResults = () => {
		if (this.state.searchStarted && !this.searchCompleted) {
			return (
				<View>
					{/* possibly add fast fashion facts */}
					<Spinner color="green" />
				</View>
			);
		} else if (this.state.resultItems.length > 0 && this.state.searchCompleted) {
			return this.state.resultItems.map((id, item) => {
				return (
					<Item
						key={id.itemLink}
						itemName={id.itemName}
						itemPrice={id.itemPrice}
						itemPhoto={id.itemPhoto}
						itemLink={id.itemLink}
					/>
				);
			});
		}
		// else {
		// 	return <Text> No results </Text>;
		// }
	};
	buildLinks = async () => {
		let threadUPbaseURL = 'https://www.thredup.com/products/women?department_tags=women&sort=Relevance&text=';
		this.setState({ searchTerm: this.props.searchTerms });
		console.log('PROPS:');
		console.log(this.props.searchTerms);
		for (let i = 0; i < this.props.searchTerms.length; i += 1) {
			if (i === 0) {
				threadUPbaseURL += this.props.searchTerms[0];
			} else {
				threadUPbaseURL += `+${this.props.searchTerms[i]}`;
			}
		} // TODO modify this.state here
		await this.setState({ threadUPLink: threadUPbaseURL });
		console.log(this.state.threadUPLink);
		this.readThreadUpPage();
	};
	readThreadUpPage = async () => {
		this.setState({ searchStarted: true });
		console.log('called the read page method on' + this.state.threadUPLink);
		let htmlString = '';
		const response = await fetch(this.state.threadUPLink)
			.then(async response => {
				if (!response.ok) {
					console.log('There is an error');
				} else if (response.status === 200) {
					console.log('Got the data successfully');
					htmlString = await response.text();
					// console.log(htmlString);
				}
			})
			.catch(error => {
				console.log('there was an error');
			});
		const $ = cheerio.load(htmlString);
		const my_List = $('.results-grid-item').text();

		const name_list1 = [];
		$('.results-grid-item').each((i, el) => {
			const item = $(el)
				.find('.item-card-bottom')
				.find('.item-title')
				.text();
			name_list1.push(item);
		});
		this.setState({ name_list: name_list1 });

		const price_list1 = [];
		$('.results-grid-item').each((i, el) => {
			let priceString = $(el)
				.find('.price-line')
				.find('.formatted-prices')
				.text();
			priceString = priceString.split('$');
			const priceInDollars = `$${priceString[1]}`;
			price_list1.push(priceInDollars);
		});
		this.setState({ price_list: price_list1 });

		const link_list1 = [];
		$('.results-grid-item').each((i, el) => {
			const item = $(el)
				.find('a')
				.attr('href');
			const full_link = `https://www.thredup.com${item}`;
			link_list1.push(full_link);
		});
		this.setState({ link_list: link_list1 });

		const photo_list1 = [];
		// TODO: remove the 5 here
		// for(let i = 0; i< link_list1.length; i++){
		for (let i = 0; i < 5; i++) {
			await axios
				.get(link_list1[i])
				.then(response => {
					const $ = cheerio.load(response.data);
					// const link = $('img').attr('src');
					let link2 = $('.zoom-overlay').css('background-image');
					// break up link 2 and get the exact address:
					link2 = link2.slice(4, link2.length - 1);
					console.log('extracting link here');
					console.log(link2);
					photo_list1.push(link2);
				})
				.catch(error => {
					console.log(error);
				});
		}
		this.setState({ photo_list: photo_list1 });

		console.log('completed extracting links. Now printing everything:');

		// TODO : remove the 5 here
		for (let i = 0; i < 5; i++) {
			console.log(name_list1[i], price_list1[i], link_list1[i], photo_list1[i]);
		}

		console.log('exit the function');
		this.buildSearchResults();
	};

	// buildLinks() {
	// 	let swapURL = 'https://www.swap.com/shop/?q=';
	// 	for (let i = 0; i < this.state.searchTerm.length; i++) {
	// 		if (i === 0) {
	// 			swapURL += this.state.searchTerm[0];
	// 		} else {
	// 			swapURL += `%20${this.state.searchTerm[i]}`;
	// 		}
	// 	}
	// 	console.log(swapURL);
	// }

	buildSearchResults() {
		const accumulator = [];
		for (let i = 0; i < 5; i++) {
			const singleItem = {
				itemPrice: this.state.price_list[i],
				itemName: this.state.name_list[i],
				itemLink: this.state.link_list[i],
				itemPhoto: this.state.photo_list[i],
			};
			accumulator.push(singleItem);
		}
		this.setState({ resultItems: accumulator, searchCompleted: true, searchStarted: false });
	}

	render() {
		return (
			<View>
				{
					// to view what the current search terms are
					// for testing with Watson
					// <Text>
					//   {' '}
					//   {this.state.searchTerm.join(' ')}
					//   {' '}
					// </Text>
				}
				<Text> </Text>
				<Button iconRight block success onPress={this.buildLinks}>
					<Text> Find My Thrifty Inspiration </Text>
					<Icon name="search" />
				</Button>
				{this.renderResults()}
			</View>
		);
	}
}
