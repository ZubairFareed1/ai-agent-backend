const fs = require('fs')
const path = require('path')
const mammoth = require('mammoth')
const pdfParse = require('pdf-parse')


function cleanText(text, specialChars = "!@#$%^&*()[]{};:,<>?/|`~") {
    // Create a regex pattern for the special characters
    const specialCharsRegex = new RegExp(`[${specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}]`, "g");
    
    // Replace newlines with a space
    let cleanedText = text.replace(/[\r\n]+/g, " ");
    
    // Remove special characters
    cleanedText = cleanedText.replace(specialCharsRegex, "");
    
    // Remove multiple spaces
    cleanedText = cleanedText.replace(/\s+/g, " ");
    
    // Trim leading and trailing spaces
    return cleanedText.trim();
  }
  
  // Example usage
  const inputText = `
  This is an example text! It has newlines,    multiple spaces,
  and special characters like @, #, and $. 
  `;
  
  const cleanedText = cleanText(inputText);
  console.log(cleanedText);

  
exports.ExtractText = async (file) => {
    try {
        let text = '';
        if (!file) {
            throw new Error('No file uploaded.');
                }
        //check file extension
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
