# green-eyes
CS89 Watson Project Team 4

### Description
React Native app with Node.js backend to classify photos into outfits and search thrift shop catalogues. Uses Native Base UI library to style the app. The git repository is stored [here:](https://github.com/emmaxs/green-eyes)

### Instructions
1) Clone the repository
2) In `server/`, run `yarn install` and `node index.js`
3) In `mobile/`, run `yarn install` and `yarn start` or `expo start` to start expo.

Important Note: To get this app to work on your computer, you will have to replace `IP` variable in `HomeScreen.js` unique IP address. If this is your first time running the app, you will also need to make sure you have a `server/images/` directory. This is essentially a one screen app, but the major search component is also stored in `screens/SearchScreen.js`.

Go ahead and play with the app in a simulator!

### Current Functionality
- Upload photo from gallery or camera
- Submit to our trained Watson visual recognition model
- Extract a set of search terms from the results
- Search terms on ThredUp.com
- Display results as cards
- Open a link to ThredUp for each item

### Next Steps
- Add website names to the cards
- Add additional websites to crawl

### Should Do
- Change auth files and urls to a separate .env file
- Change image storage to some kind of public directory
- Reduce package dependencies
