const Express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
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
		// classifier_ids: ['food'],
		threshold: 0.2,

		/* otherwise */
		owners: ['IBM'],
	};

	visualRecognition
		.classify(classifyParams)
		.then(classifiedImages => {
			/* send an array */
			const classLabels = [];
			const scoreLabels = [];
			const JSONLabels = JSON.parse(JSON.stringify(classifiedImages)).images[0].classifiers[0].classes;
			console.log(JSON.parse(JSON.stringify(classifiedImages)).images[0].classifiers[0].classes);
			for (var i = 0; i < JSONLabels.length; i++) {
				classLabels.push(JSONLabels[i].class);
				scoreLabels.push(JSONLabels[i].score);
			}
			// console.log(classLabels);
			// console.log(scoreLabels);
			res.send({
				classes: classLabels.toString(),
				scores: scoreLabels.toString(),
				message: 'successful upload!',
			});
		})
		.catch(err => {
			res.status(400).json({
				error: err,
			});
			console.log('error:', err);
		});
});

// app.post('/api/url', (req, res) => {
// 	var url = req.body.url;
// 	var classifier_ids = ['food'];

// 	var params = {
// 		url: url,
// 		classifier_ids: classifier_ids,
// 	};

// 	visualRecognition.classify(params, function(err, response) {
// 		if (err) console.log(err);
// 		else console.log(JSON.stringify(response, null, 2));
// 	});

// 	res.status(200).json({
// 		message: 'successful test fruit url!',
// 	});
// });

app.listen(3000, () => {
	console.log('App running on http://localhost:3000');
});
