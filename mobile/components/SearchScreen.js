import React from 'react';
import {Text, Web, View, Button, Image} from 'react-native';
import axios from 'axios';

import cheerio from 'react-native-cheerio';

export default class SearchScreen extends React.Component{
  // constructor here
  //
  constructor(props) {
  super(props);
  this.state = {
    searchTerm: ["red", "shoes"],
    threadUPLink: 'https://www.thredup.com/products/women?department_tags=women&sort=Relevance&text=red+shoes',
    swapLink: 'https://www.swap.com/shop/?q=red%20shoes',
    resultItems: [],
    name_list :[],
    price_list : [],
    link_list :[],
    searchCompleted: false,
    photo_list: [],
    sample_item1: {
      itemLink: 'https://www.thredup.com/product/women-shoes-koala-kids-red-water-shoes/46504677',
      itemPhoto: 'https://cf-assets-thredup.thredup.com/assets/136251025/xlarge.jpg',
      itemName: 'Water Shoes',
      itemPrice: '$20',
    }
  };

      this.renderResults = this.renderResults.bind(this);
      this.buildLinks = this.buildLinks.bind(this);
      this.readThreadUpPage = this.readThreadUpPage.bind(this);
      this.buildSearchResults = this.buildSearchResults.bind(this);
      this.render = this.render.bind(this);

}

// {this.state.resultItems.length == 0 && <Text> Nothing to display yet</Text> }
// {this.state.resultItems.length > 0 && this.state.searchCompleted && <Text> Search has items for display </Text>}

  renderResults = () => {
    if(this.state.resultItems.length == 0 ){
      return (
        <View>
          <Text> Nothing to display yet 1</Text>
        </View>
      );
    }
    else if (this.state.resultItems.length > 0 && this.state.searchCompleted){
      // do the map work here
      //return (<Text> Nothing to display yet 2</Text>);
      console.log(this.state.resultItems[0].itemPhoto);
      return this.state.resultItems.map( (id, item)=> {
        return(

          <View>
            <Text>{id.itemName}</Text>
            <Image style={{width: 200, height: 200}}
            source={{uri: id.itemPhoto}}/>
            <Text>{id.itemPrice}</Text>
          </View>
        );
      }


      );
      // return(
      //   <View>
      //     <Text>{this.state.resultItems[0].itemName}</Text>
      //     <Image style={{width: 200, height: 200}}
      //     source={{uri: this.state.resultItems[0].itemPhoto}}/>
      //     <Text>{this.state.resultItems[0].itemPrice}</Text>
      //   </View>
      // );
    } else{
      return (<Text> Nothing to display yet 3</Text>);
    }
    // return(
    //   //<View>
    //     //<Text> Nothing to display yet</Text>
    //     if(this.state.resultItems.length == 0 ){
    //       return (<Text> Nothing to display yet</Text>);
    //     }
    //     }
    //   { this.state.resultItems.length == 0 && <Text> Nothing to display yet</Text> }
    //   // {this.state.resultItems.length > 0 && this.state.searchCompleted && <Text> Search has items for display </Text>}
    //   //</View>
    // );
  }

  // renderResults(){
  //   return (this.state.resultItems.length == 0 && <Text> Nothing to display yet</Text>) ;
  // }
  buildLinks(){
    var threadURL = '';
    var swapURL = 'https://www.swap.com/shop/?q=';
    for(let i = 0; i < this.state.searchTerm.length; i++){
      if(i===0){
        swapURL += this.state.searchTerm[0];
      } else{
        swapURL += "%20"+ this.state.searchTerm[i];
      }
    }
    console.log(swapURL);
  }

  readThreadUpPage = async () => {
    console.log("called the read page method");
    var htmlString = '' ;
    const response = await fetch(this.state.threadUPLink).then(
        async (response) =>{
        if (!response.ok){
          console.log("There is an error");
        }
        else if(response.status === 200){
          console.log("Got the data successfully");
          htmlString = await response.text();
          //console.log(htmlString);
        }
    }).catch(function(error){
      console.log("there was an error");
    });
    const $ = cheerio.load(htmlString);
    const my_List = $('.results-grid-item').text();

    var name_list1 = [];
    $('.results-grid-item').each((i,el) => {
      const item = $(el).find('.item-card-bottom').find('.item-title').text();
      name_list1.push(item);
    });
    this.setState({name_list: name_list1});

    var price_list1 = [];
    $('.results-grid-item').each((i,el) => {
      const item = $(el).find('.price-line').find('.formatted-prices').text();
      price_list1.push(item);
    });
    this.setState({price_list: price_list1});

    var link_list1 = [];
    $('.results-grid-item').each((i,el) => {
      const item = $(el).find('a').attr('href');
      full_link = 'https://www.thredup.com' + item;
      link_list1.push(full_link);
    });
    this.setState({link_list: link_list1});


    photo_list1 = [];
    // for(let i = 0; i< link_list1.length; i++){
    for(let i = 0; i< 5; i++){
      await axios.get(link_list1[i]).then((response)=>{
      const $ = cheerio.load(response.data);
      //const link = $('img').attr('src');
      var link2 = $('.zoom-overlay').css('background-image');
      // break up link 2 and get the exact address:
      link2 = link2.slice(4, link2.length - 1);
      console.log('extracting link here');
      console.log(link2);
      photo_list1.push(link2);
      }).catch((error)=>{
        console.log(error);
      });
    }
    this.setState({photo_list: photo_list1});

    console.log('completed extracting links. Now printing everything:');


    for (let i = 0; i < 5; i++){
      console.log(name_list1[i] ,  price_list1[i] ,  link_list1[i], photo_list1[i]);
    }
    console.log('exit the function');
    this.buildSearchResults();
  }

  buildSearchResults(){
    if ( this.state === undefined ){
      console.log("state is empty 1");
      return;
    }
    if ( this.state.name_list === undefined  ){
      console.log("state is empty 2");
      return;
    }
    if ( this.state.name_list.length == 0 ){
      console.log("state is empty 3");
      return;
    }
  console.log( this.state.name_list.length,
    this.state.price_list.length,
    this.state.link_list.length,
    this.state.photo_list.length);
    var accumulator = [];
    for (let i = 0; i < 5; i++){
      var singleItem = {
        itemPrice: this.state.price_list[i],
        itemName: this.state.name_list[i],
        itemLink: this.state.link_list[i],
        itemPhoto: this.state.photo_list[i],
      }
      accumulator.push(singleItem);
    }
    this.setState({resultItems: accumulator, searchCompleted: true});
  }


  render(){
    return(

      <View>
        <Text> {this.state.searchTerm.join(" ")} </Text>
        <Button
        onPress={this.readThreadUpPage}
        title="Search"
        color="#841584"
        accessibilityLabel="Search"/>

        <Button
        onPress={this.buildSearchResults}
        title="Show search results"
        color="#841584"
        accessibilityLabel="RenderSearch"/>

        {this.renderResults()}
      </View>



      );

      //<View> {this.renderResults()} </View>
    //</View>
    // <Button
    // onPress={this.readThreadUpPage}
    // title="Search"
    // color="#841584"
    // accessibilityLabel="Search"/>
    //
    // <Button
    // onPress={this.buildSearchResults}
    // title="Show search results"
    // color="#841584"
    // accessibilityLabel="RenderSearch"/>
    }
  }




// results-grid-item
  // carousel-results-item item-card listed
    // item-card-top (has pics)
