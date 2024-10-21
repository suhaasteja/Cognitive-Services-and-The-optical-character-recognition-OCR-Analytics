document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const selectImageBtn = document.getElementById('selectImage');
    const analyzeBtn = document.getElementById('analyzeImage');
    const ocrResult = document.getElementById('ocrResult');

    selectImageBtn.addEventListener('click', () => {
        imageInput.click();
    });

    analyzeBtn.addEventListener('click', async () => {
        const file = imageInput.files[0];
        if (!file) {
            alert('Please select an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('OCR analysis failed');
            }

            const result = await response.json();
            ocrResult.textContent = JSON.stringify(result, null, 2);
        } catch (error) {
            console.error('Error:', error);
            ocrResult.textContent = 'An error occurred during OCR analysis.';
        }
    });
});