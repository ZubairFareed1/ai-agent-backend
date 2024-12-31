const fs = require('fs')
const path = require('path')
const mammoth = require('mammoth')
const pdfParse = require('pdf-parse')


function cleanText(text, specialChars = "!@#$%^&*()[]{};:,<>?/|`~") {
    const specialCharsRegex = new RegExp(`[${specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}]`, "g");
    
    let cleanedText = text.replace(/[\r\n]+/g, " ");
    
    cleanedText = cleanedText.replace(specialCharsRegex, "");
    
    cleanedText = cleanedText.replace(/\s+/g, " ");
    
    return cleanedText.trim();
  }
  

  
exports.ExtractText = async (file) => {
    try {
        let text = '';
        if (!file) {
            throw new Error('No file uploaded.');
                }
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (fileExtension === '.pdf') {
            const dataBuffer = fs.readFileSync(file.path)
            const data = await pdfParse(dataBuffer)
            text = data.text
            return cleanText(text);
        }
        else if (fileExtension === '.docx') {
            const result = await mammoth.extractRawText({ path: file.path });
            text = result.value;
            return cleanText(text);
        }
        else if (fileExtension === '.dox') {
            const result = await mammoth.extractRawText({ path: file.path });
            text = result.value;
            return cleanText(text);
        }
        else {
            throw new Error('Invalid file format. Only .docx files are allowed.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
