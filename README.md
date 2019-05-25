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
- Extract a set of search terms from the results
- Search terms on ThredUp.com
- Display results as cards
- Open a link to ThredUp for each item

### Next Steps
- Add Website Names to the cards
- Add additional websites to crawl
- Improve Classifier

### Should Do
- Change auth files and urls to a separate .env file
- Change image storage to some kind of public directory
- Reduce package dependencies
