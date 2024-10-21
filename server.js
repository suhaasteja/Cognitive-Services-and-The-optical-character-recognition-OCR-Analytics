const express = require('express');
const multer = require('multer');
const path = require('path');
const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis');
const createClient = require('@azure-rest/ai-vision-image-analysis').default;
const { AzureKeyCredential } = require('@azure/core-auth');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

const endpoint = process.env.VISION_ENDPOINT;
const key = process.env.VISION_KEY;

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

app.use(express.static('public'));

app.post('/analyze', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No image file uploaded.');
    }

    const features = ['Caption', 'Read'];

    try {
        const result = await client.path('/imageanalysis:analyze').post({
            body: {
                file: req.file.buffer
            },
            queryParameters: {
                features: features
            },
            contentType: 'application/octet-stream'
        });

        const iaResult = result.body;
        res.json(iaResult);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred during OCR analysis.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));