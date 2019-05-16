const Express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = Express();
app.use(bodyParser.json());

// Sets up where to store POST images
const storage = multer.diskStorage({
	destination: function(req, res, cb) {
		cb(null, './images');
	},
});
const upload = multer({ storage: storage });

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
	version: '2018-03-19',
	iam_apikey: 'g6MjJJPhgOv5oZ5cIN_bK4yKBGwOq-tuaNtrsYcA7Egh',
});

app.get('/', (req, res) => {
	res.status(200).send('You can post to /api/upload.');
});

// app.post('/api/upload', upload.array('photo', 3), (req, res) => {
// 	console.log('file', req.files);
// 	console.log('body', req.body);
// 	res.status(200).json({
// 		message: 'success!',
// 	});
// });

app.post('/api/upload', upload.single('photo'), (req, res) => {
	// var url = req.body.photo.uri;
	// var classifier_ids = ['food'];

	// var params = {
	// 	url: url,
	// 	classifier_ids: classifier_ids,
	// };

	// visualRecognition.classify(params, function(err, response) {
	// 	if (err) console.log(err);
	// 	else console.log(JSON.stringify(response, null, 2));
	// });
	console.log('file', req.files);
	console.log('body', req.body);
	res.status(200).json({
		message: 'successful upload!',
	});
});

app.post('/api/url', (req, res) => {
	var url = req.body.url;
	var classifier_ids = ['food'];

	var params = {
		url: url,
		classifier_ids: classifier_ids,
	};

	visualRecognition.classify(params, function(err, response) {
		if (err) console.log(err);
		else console.log(JSON.stringify(response, null, 2));
	});

	// console.log('file', req.files);
	// console.log('body', req.body);
	res.status(200).json({
		message: 'successful url!',
	});
});

app.listen(3000, () => {
	console.log('App running on http://localhost:3000');
});
