import React from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'native-base';
import axios from 'axios';

import cheerio from 'react-native-cheerio';
import Item from '../components/Item';

export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ['yellow', 'shoes'],
      threadUPLink: 'https://www.thredup.com/products/women?department_tags=women&sort=Relevance&text=red+shoes',
      resultItems: [],
      name_list: [],
      price_list: [],
      link_list: [],
      searchCompleted: false,
      photo_list: [],
    };

    this.renderResults = this.renderResults.bind(this);
    this.buildSearchURL = this.buildSearchURL.bind(this);
    this.buildLinks = this.buildLinks.bind(this);
    this.readThreadUpPage = this.readThreadUpPage.bind(this);
    this.buildSearchResults = this.buildSearchResults.bind(this);
    this.render = this.render.bind(this);
  }

	renderResults = () => {
	  if (this.state.resultItems.length === 0) {
	    return (
  <View>
    <Text> Nothing to display yet </Text>
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
	  } else {
	    return <Text> No results </Text>;
	  }
	};

	buildSearchURL = () => {
	  // get the json from watson
	  // take the top three terms
	  // using those build this.state.threadUPLink (call build links)
	  // call readThreadUpPage
	  // this should be called when the search button is pressed

	}

	readThreadUpPage = async () => {
	  console.log('called the read page method');
	  let htmlString = '';
	  await fetch(this.state.threadUPLink)
	    .then(async (response) => {
	      if (!response.ok) {
	        console.log('There is an error');
	      } else if (response.status === 200) {
	        console.log('Got the data successfully');
	        htmlString = await response.text();
	        // console.log(htmlString);
	      }
	    })
	    .catch((error) => {
	      console.log('there was an error');
	    });
	  const $ = cheerio.load(htmlString);

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
	  for (let i = 0; i < 5; i += 1) {
	    await axios
	      .get(link_list1[i])
	      .then((response) => {
	        const $ = cheerio.load(response.data);
	        // const link = $('img').attr('src');
	        let link2 = $('.zoom-overlay').css('background-image');
	        // break up link 2 and get the exact address:
	        link2 = link2.slice(4, link2.length - 1);
	        console.log('extracting link here');
	        console.log(link2);
	        photo_list1.push(link2);
	      })
	      .catch((error) => {
	        console.log(error);
	      });
	  }
	  this.setState({ photo_list: photo_list1 });

	  console.log('completed extracting links. Now printing everything:');

	  // TODO : remove the 5 here
	  for (let i = 0; i < 5; i += 1) {
	    console.log(name_list1[i], price_list1[i], link_list1[i], photo_list1[i]);
	  }

	  console.log('exit the function');
	  this.buildSearchResults();
	};

	buildLinks() {
	  let threadUPbaseURL = 'https://www.thredup.com/products/women?department_tags=women&sort=Relevance&text=';
	  for (let i = 0; i < this.state.searchTerm.length; i += 1) {
	    if (i === 0) {
	      threadUPbaseURL += this.state.searchTerm[0];
	    } else {
	      threadUPbaseURL += `+${this.state.searchTerm[i]}`;
	    }
	  }
	  // TODO modify this.state here
	  console.log(threadUPbaseURL);
	}

	buildSearchResults() {
	  const accumulator = [];
	  for (let i = 0; i < 5; i += 1) {
	    const singleItem = {
	      itemPrice: this.state.price_list[i],
	      itemName: this.state.name_list[i],
	      itemLink: this.state.link_list[i],
	      itemPhoto: this.state.photo_list[i],
	    };
	    accumulator.push(singleItem);
	  }
	  this.setState({ resultItems: accumulator, searchCompleted: true });
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
    {/* <Button
          onPress={this.readThreadUpPage}
          title="Search"
          color="#841584"
          accessibilityLabel="Search"
        /> */}
    <Button iconLeft block success onPress={this.readThreadUpPage}>
      <Text>Search for Red Shoes</Text>
      <Icon name="beer" />
    </Button>
    {this.renderResults()}
  </View>
	  );
	}
}
