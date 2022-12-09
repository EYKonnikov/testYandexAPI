const API_KEY = "AQVNzldvw-weQv4FT4HIm1aMYQ6qJzGxC09joiEk"
const FOLDER_ID = "b1g7nus0q6mur062h1ua"

const screenshot = require('screenshot-desktop');
const fs = require('fs');



screenshot().then((img) => {

	let imageBase64 = img.toString('base64');

	console.log('Screenshot was taken. Starting send response');

	sendImage(API_KEY, FOLDER_ID, imageBase64);

}).catch((err) => {
	console.log('Error, something went wrong')
})


function sendImage(apiKey, folderId, imgBase64) {

	fetch('https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze', {
			method: 'POST',
			headers: {
				'Authorization': `Api-Key ${apiKey}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				"folderId": folderId,
				"analyze_specs": [{
					"content": imgBase64,
					"features": [{
						"type": "TEXT_DETECTION",
						"text_detection_config": {
							"language_codes": ["*"]
						}
					}]
				}]
			})
		}).then(data => data.json())
		.then(json => {

			let blocks = json.results[0].results[0].textDetection.pages[0].blocks
			let text = []
			blocks.forEach(item => {
				text.push(item.lines[0].words[0].text)
			});

			fs.writeFile('textFromImage.txt', JSON.stringify(text), function(err) {
				if (err) return console.log(err);
				console.log('Hello World > textFromImage.txt');
			});


		})

}
