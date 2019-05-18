const Express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const fs = require('fs');

// Sets up express
const app = Express();
app.use(bodyParser.json());

const location = './images';
// Sets up where to store POST images
const storage = multer.diskStorage({
	destination: function(req, res, cb) {
		cb(null, location);
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
	var classifyParams = {
		images_file: fs.createReadStream(`${location}/${req.file.filename}`),
		/* just for food */
		classifier_ids: ['food'],

		/* otherwise */
		// owners: ['me'],
		threshold: 0.6,
	};

	visualRecognition
		.classify(classifyParams)
		.then(classifiedImages => {
			console.log(classifiedImages);
			const label = JSON.parse(JSON.stringify(classifiedImages)).images[0].classifiers[0].classes[0].class;
			res.send({ data: label, message: 'successful upload!' });
		})
		// .then(
		// 	res.status(200).json({
		// 		message: 'successful upload!',
		// 	})
		// )
		.catch(err => {
			res.status(400).json({
				error: err,
			});
			console.log('error:', err);
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
		message: 'successful test fruit url!',
	});
});

app.listen(3000, () => {
	console.log('App running on http://localhost:3000');
});
