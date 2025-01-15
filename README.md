# Traffic Law Chatbot (דיני תעבורה צ'אטבוט)

## Overview
An interactive chatbot specialized in Israeli traffic laws, capable of processing and analyzing various document formats including PDFs, images, and Word documents. The system uses OpenAI's GPT model for intelligent responses and document analysis.

## Features
- Real-time chat interface
- File upload and analysis capabilities:
  - PDF document processing
  - Image text extraction (OCR)
  - Word document (.doc, .docx) processing
- Intelligent responses using OpenAI's GPT model
- RTL (Right-to-Left) support for Hebrew
- Modern, responsive UI design

## Prerequisites
- Node.js (v14 or higher)
- NPM (Node Package Manager)
- OpenAI API key

## Required Dependencies
```bash
npm install express
npm install cors
npm install multer
npm install pdf-parse
npm install tesseract.js
npm install mammoth
npm install dotenv
npm install openai
npm install axios
```

## Installation
1. Clone the repository:
```bash
git clone [your-repository-url]
cd [project-directory]
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Create an uploads directory:
```bash
mkdir uploads
```

## Project Structure
```
project/
├traffic-law-web/
├── server.js
├── chatbot.html
├── uploads/
├── .env
├── package.json
├.gitignore
└ README.md
```

## Running the Application
1. Start the server:
```bash
node server.js
```

2. Access the application:
Open `http://localhost:3000` in your web browser

## Features Description

### Chat Interface
- Real-time message exchange
- Loading indicators
- File upload capability
- Responsive design

### File Processing
- **PDF Files**: Extracts and analyzes text content
- **Images**: Uses OCR to extract text from images
- **Word Documents**: Processes .doc and .docx files

### AI Integration
- Uses OpenAI's GPT model for:
  - Answering questions about traffic laws
  - Analyzing uploaded documents
  - Providing legal insights and explanations

## Security Considerations
- Implements file type validation
- Automatic file cleanup after processing
- Secure API key handling through environment variables

## Error Handling
- File upload validation
- Server connection error handling
- Processing error management
- User feedback for all error states

## Contributing
Feel free to submit issues and enhancement requests.



## Acknowledgments
- OpenAI for GPT integration
- Tesseract.js for OCR capabilities
- All other open-source contributors

## License
© Enas Jaber

This project was developed as part of the "CYBER LAW" course at SCE College.