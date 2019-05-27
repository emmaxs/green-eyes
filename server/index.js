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

// establishes colors
const colors = new Set([
	'red',
	'yellow',
	'orange',
	'green',
	'blue',
	'gray',
	'black',
	'brown',
	'purple',
	'white',
	'beige',
]);

// new Visual Recognition service, change API key with new models
var visualRecognition = new VisualRecognitionV3({
	version: '2018-03-19',
	iam_apikey: 'zxF3a_QZj68DHe_xerqT6N4keCm0z4sBiZyPiQgQYWU2',
});

app.get('/', (req, res) => {
	res.status(200).send('You can post to /api/upload.');
});

app.post('/api/upload', upload.single('photo'), (req, res, next) => {
	var classifyParams = {
		images_file: fs.createReadStream(`${location}/${req.file.filename}`),
		/* just for food */
		// classifier_ids: ['food'],
		threshold: 0.1,

		/* otherwise */
		owners: ['me'],
	};

	visualRecognition
		.classify(classifyParams)
		.then(classifiedImages => {
			/* send an array */
			const classLabels = [];
			const scoreLabels = [];
			const JSONLabels = JSON.parse(JSON.stringify(classifiedImages)).images[0].classifiers[0].classes;
			// console.log(JSON.parse(JSON.stringify(classifiedImages)).images[0].classifiers[0].classes);
			var needColor = true;
			var sortingArray = [];
			for (var i = 0; i < JSONLabels.length; i++) {
				sortingArray.push([JSONLabels[i].class, JSONLabels[i].score]);
			}
			sortingArray.sort(function(a, b) {
				return b[1] - a[1];
			});
			for (var i = 0; i < sortingArray.length; i++) {
				if (colors.has(sortingArray[i][0])) {
					if (needColor) {
						needColor = false;
						classLabels.push(sortingArray[i][0]);
						scoreLabels.push(sortingArray[i][1]);
					}
				} else {
					if (sortingArray[i][0] === 'tshirt') {
						classLabels.push('t-shirt');
						scoreLabels.push(sortingArray[i][1]);
					} else {
						classLabels.push(sortingArray[i][0]);
						scoreLabels.push(sortingArray[i][1]);
					}
				}
			}
			console.log(sortingArray);
			res.send({
				classes: classLabels.slice(0, 2).toString(),
				scores: scoreLabels.slice(0, 2).toString(),
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
