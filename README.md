# green-eyes
CS89 Watson Project Team 4

### Description
React Native app with Node.js backend to classify photos into outfits and search thrift shop catalogues. Uses Native Base UI library to style the app.

### Instructions
1) Clone the repository
2) In `server/`, run `yarn install` and `node index.js`
3) In `mobile/`, run `yarn install` and `yarn start` or `expo start` to start expo.

Go ahead and play with the app in a simulator!

### Current Functionality
- Upload photo from gallery or camera
- Submit to Watson Food Recognition Service
- Extract a Keyword from the results

- Run a search on 'red shoes' display the result
- Dummy front-end Deck Swiper component

### Next Steps
- Display threshold results of classification
- UI Changes
- Add Picker to select attributes of clothing to add to keywords

### Main Steps
- Query the fashion classifier
- Make the search keyword match the classifier results

###  UI Changes
[ ] Add Splash Screen
[ ] Figure out text information
[ ] Improve UI

### Should Do
- Change auth files and urls to a separate .env file
- Change image storage to some kind of public directory
