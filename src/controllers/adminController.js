exports.fileUpload = async (req, res) => {
    try {
        const file = req.file; // Access the uploaded file
        console.log(file); // Log the file information for debugging
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }
        res.status(200).send('File uploaded successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
