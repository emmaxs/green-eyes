import React from 'react';
import {Text, Web, View, Button} from 'react-native';
import axios from 'axios';

import cheerio from 'react-native-cheerio';

export default class SearchScreen extends React.Component{
  state = {
    searchTerm: ["red", "shoes"],
    threadUPLink: 'https://www.thredup.com/products/women?department_tags=women&sort=Relevance&text=red+shoes',
    swapLink: 'https://www.swap.com/shop/?q=red%20shoes',

  };

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
    // this.setState({swapLink: swapURL});
    console.log(swapURL);

  }

  readAxios(){
  axios.get('https://www.thredup.com/products/women?department_tags=women&sort=Relevance&text=red+shoes').then((response) => {
  const $ = cheerio.load(response.data)
  console.log(response.data);
  $('img').each((i,el) => {
    console.log("Found Imagesssssssss");
    //const item = $(el).attr('src');
    //console.log(item);
    // pic_list.push(item);
  });
  // $('.results-grid-item').each((i,el) => {
  //   const item = $(el).find('img').attrib('src');
  //   console.log('items here:');
  //   console.log(item);
  // });

  // const images = $('img').eachattrib('src');
  //
  // // We now loop through all the elements found
  // for (let i = 0; i < images.length; i++) {
  //   console.log('image ', i);
  // }
  console.log('finished looping through images');
}).catch((error) => {
  console.log('axios get failed');
  console.log(error);
})
  }

  readSwapPage = async () => {
    console.log("called the read page method");
    var htmlString = '' ;
    const response = await fetch(this.state.swapLink).then(
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
    console.log("am i getting here?");
    //const htmlString = await response.text();

    const $ = cheerio.load(htmlString);
    //console.log($.html());
    //const my_List = $('#pagebody').find('ul').text();
    //const my_List = $('').text();
    //console.log(my_List);
    //console.log(my_List.length);

    // $('#pagebody').find('ul').map(
    //   function(i, el){
    //     return $(this).text();
    //   }
    // ).get().join(' huh ');

    //console.log(htmlString);
    var name_list = [];
    $('.item-card').each((i,el) => {
      const item = $(el).find('.Card_details_18WpU').find('p').text();
      //console.log('here we go');
      //name_list.push(item);
      console.log('item');
    });
    console.log($('.card-item').length);
    console.log("printed the list");
    //const $$ = cheerio.load($('.results-grid-item').html())
    // var pic_list = [];
    // console.log('about to scrap the picture locations ');
    // console.log($('.results-grid-item').find('.item-card-top').find('._1fkzD').html());
    // $('img').each((i,el) => {
    //   console.log("Found Imagesssssssss");
    //   const item = $$(el).attrib('src');
    //   //console.log('here we go');
    //   pic_list.push(item);
    // });
    // console.log('finished scraping the picture locations ');


    // var price_list = [];
    // $('.results-grid-item').each((i,el) => {
    //   const item = $(el).find('.price-line').find('.formatted-prices').text();
    //   //console.log('here we go');
    //   price_list.push(item);
    // });


    for (let i = 0; i < 10; i++){
      //console.log(name_list[i] ,  price_list[i] ,  pic_list[i]);
      //console.log(name_list[i])
    }
    //console.log(name_list[1]);
    //console.log($('li').get().length);
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

    var name_list = [];
    $('.results-grid-item').each((i,el) => {
      const item = $(el).find('.item-card-bottom').find('.item-title').text();
      name_list.push(item);
    });


    var price_list = [];
    $('.results-grid-item').each((i,el) => {
      const item = $(el).find('.price-line').find('.formatted-prices').text();
      price_list.push(item);
    });

    var link_list = [];
    $('.results-grid-item').each((i,el) => {
      const item = $(el).find('a').attr('href');
      full_link = 'https://www.thredup.com' + item;
      link_list.push(full_link);
    });

    photo_list = []
    for(let i = 0; i< link_list.length; i++){
      await axios.get(link_list[i]).then((response)=>{
      const $ = cheerio.load(response.data);
      //const link = $('img').attr('src');
      var link2 = $('.zoom-overlay').css('background-image');
      // break up link 2 and get the exact address:
      link2 = link2.slice(4, link2.length - 1);
      console.log('extracting link here');
      console.log(link2);
      photo_list.push(link2);
      }).catch((error)=>{
        console.log(error);
      });
    }
    console.log('completed extracting links. Now printing everything:');


    for (let i = 0; i < 10; i++){
      console.log(name_list[i] ,  price_list[i] ,  link_list[i], photo_list[i]);
    }
    //console.log(name_list[1]);
    //console.log($('li').get().length);
    console.log('exit the function');
  }


  render(){
    return(
      <View>
      <Text> {this.state.searchTerm.join(" ")} </Text>
            <Button
        onPress={this.readThreadUpPage}
        title="Search"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      </View>

    );
  }
}

// results-grid-item
  // carousel-results-item item-card listed
    // item-card-top (has pics)
