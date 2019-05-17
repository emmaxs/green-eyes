const Express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const fs = require('fs');

// Sets up express
const app = Express();
app.use(bodyParser.json());

// Sets up where to store POST images
const storage = multer.diskStorage({
	destination: function(req, res, cb) {
		cb(null, './images');
	},
	filename(req, file, callback) {
		callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
	},
});
const upload = multer({ storage: storage });

// new Visual Recognition service
var visualRecognition = new VisualRecognitionV3({
	version: '2018-03-19',
	iam_apikey: 'g6MjJJPhgOv5oZ5cIN_bK4yKBGwOq-tuaNtrsYcA7Egh',
});

app.get('/', (req, res) => {
	res.status(200).send('You can post to /api/upload.');
});

app.post('/api/upload', upload.single('photo'), (req, res, next) => {
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
	// console.log('file', req.file);
	// console.log('body', req.body);

	// fs.readFile(req.file.path, (err, contents) => {
	// 	if (err) {
	// 		console.log('Error: ', err);
	// 	} else {
	// 		console.log('File contents ', contents);
	// 	}
	// });
	// res.json(req.file);
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

	res.status(200).json({
		message: 'successful url!',
	});
});

app.post('/api/fruit', (req, res) => {
	var classifyParams = {
		images_file: fs.createReadStream(req.body.file),
		/* just for food */
		classifier_ids: ['food'],
		/* otherwise */

		// owners: ['me'],
		// threshold: 0.6,
	};

	visualRecognition
		.classify(classifyParams)
		.then(classifiedImages => {
			console.log(JSON.stringify(classifiedImages, null, 2));
		})
		.catch(err => {
			console.log('error:', err);
		});

	res.status(200).json({
		message: 'successful fruit!',
	});
});

app.listen(3000, () => {
	console.log('App running on http://localhost:3000');
});
