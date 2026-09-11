# 🤖 AI Resume Analyzer

An AI-powered web application that analyzes a resume against a job description and provides an ATS compatibility score, matching skills, missing skills, strengths, keyword analysis, and personalized improvement suggestions.

## 🌐 Live Demo

👉 **[AI Resume Analyzer - Live Demo](https://ai-resume-analyzer-kappa-kohl.vercel.app/)**

### 🔧 Backend API

👉 **[AI Resume Analyzer API](https://ai-resume-analyzer-9tmb.onrender.com/)**

## 📌 Overview

The **AI Resume Analyzer** helps job seekers understand how well their resume matches a specific job description.

Users can either:

- Paste their resume text
- Upload a PDF resume
- Paste a job description
- Analyze the resume using AI
- View ATS compatibility results
- Identify matching and missing skills
- Check important keywords
- Get resume improvement suggestions
- Download a professional PDF analysis report
- View previous analyses using Analysis History

The application uses a **React frontend**, **Node.js + Express backend**, and **Groq AI** for intelligent resume analysis.

## ✨ Features

### 📄 Resume Input
- Paste resume text directly into the application
- Upload resume as a PDF
- Automatic text extraction from PDF files
- PDF file validation
- Maximum PDF size of 5 MB

### 🤖 AI Resume Analysis
- ATS compatibility score
- Matching skills
- Missing skills
- Resume strengths
- Improvement suggestions
- AI-powered job description comparison

### 🔍 Keyword Match Analysis
- Extracts important keywords from the job description
- Identifies keywords already present in the resume
- Identifies missing keywords
- Displays keyword match percentage

### 📊 Professional ATS Dashboard
- Visual ATS score
- Match status
- Progress indicator
- Matching skills count
- Missing skills count
- Strengths count
- Suggestions count

### 📥 PDF Report
- Generate a professional resume analysis report
- Includes ATS score
- Matching skills
- Missing skills
- Strengths
- Improvement suggestions
- Downloadable PDF format

### 📚 Analysis History
- Saves recent analysis results
- View previous analysis results
- Stores up to 10 recent analyses
- Clear analysis history when required

### 🌙 Theme Support
- Light mode
- Dark mode
- Theme preference stored locally

### 📱 Responsive Design
- Desktop
- Laptop
- Tablet
- Mobile

### 📂 Project Structure
```text
AI-Resume-Analyzer/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── ...
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── check-models.js
│   └── test-groq.js
│
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- jsPDF

### Backend

- Node.js
- Express.js
- JavaScript
- Multer
- pdf-parse
- CORS
- dotenv

### AI

- Groq API
- Qwen 3.8 27B

### Deployment

- Vercel — Frontend
- Render — Backend

### Development Tools

- Git
- GitHub
- Visual Studio Code
- Postman / Thunder Client

## 🏗️ Project Architecture

```text
User
  │
  ▼
React Frontend
(Vercel)
  │
  │ HTTP Requests
  ▼
Node.js + Express API
(Render)
  │
  ├── PDF Text Extraction
  │
  └── Resume Analysis
          │
          ▼
       Groq API
       Qwen 3.8
          │
          ▼
    AI Analysis Result
          │
          ▼
     React Dashboard
```

# 🔄 How It Works

```text
User
  │
  ▼
Upload Resume / Enter Resume Text
  │
  ▼
Enter Job Description
  │
  ▼
React Frontend
  │
  ▼
Express Backend
  │
  ▼
Groq API + Qwen 3.8 27B
  │
  ▼
AI Resume Analysis
  │
  ├── ATS Score
  ├── Matching Skills
  ├── Missing Skills
  ├── Strengths
  └── Suggestions
  │
  ▼
ATS Dashboard
  │
  ├── Keyword Analysis
  ├── Analysis History
  └── Download PDF Report
```

# 🔌 API Endpoints

## Health Check

### `GET /`

Returns the backend API status.

### Example Response

```json
{
  "message": "AI Resume Analyzer API is running"
}
```

## 📄 Extract Resume PDF

### `POST /api/extract-pdf`

Accepts a PDF resume and extracts the text from it automatically.

### Request

```text
Content-Type: multipart/form-data
```


### Part 2 — Request

```markdown
### 📤 Request

The endpoint accepts the resume PDF as a `multipart/form-data` request.

The PDF file is sent using the following form-data field:

```text
resume
```


### Part 3 — Analyze Resume

```markdown
## 🤖 Analyze Resume

### `POST /api/analyze-resume`

Analyzes the resume against the provided job description using AI.

The API evaluates:

- ATS Score
- Matching Skills
- Missing Skills
- Resume Strengths
- Improvement Suggestions

### Example Request

```json
{
  "resume": "Java Developer with experience in React and Spring Boot...",
  "jobDescription": "Looking for a Java Developer with React and Spring Boot..."
}
```

# ⚙️ Local Installation

## 1. Clone the Repository

```bash
git clone https://github.com/A-Navaneetha/AI-Resume-Analyzer.git
```
## 2.Navigate to the Project

```bash
cd AI-Resume-Analyzer
```

# 🚀 Backend Setup
Navigate to the server folder:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a .env file inside the server folder and add:
```bash
GROQ_API_KEY=your_groq_api_key
```

Start the backend server:
```bash
npm start
```

The backend will run on:
```bash
http://localhost:5000
```

# 💻 Frontend Setup

Open another terminal and navigate to the client folder:
```bash
cd AI-Resume-Analyzer/client
```

Install dependencies:
```bash
npm install
```

Create a .env file inside the client folder and add:
```bash
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

The application will run on:
```bash
http://localhost:5173
```


### 🔐 Environment Variables

```markdown
# 🔐 Environment Variables

The application uses environment variables to securely configure the backend API key and frontend API URL.

## Backend

Create the following file:

```text
server/.env
```

# Frontend
Create a .env file inside the client folder:
```text
client/.env
```
# For Local Developemnt
```text
VITE_API_URL=http://localhost:5000
```
# For Production
```text
VITE_API_URL=https://ai-resume-analyzer-9tmb.onrender.com
```

## 🎯 Use Cases

This application can be useful for:
- 👨‍🎓 College students
- 🎓 Fresh graduates
- 💼 Job seekers
- 👨‍💻 Software developers
- 🧑‍💻 Internship applicants
- 🎯 Placement preparation
- 📝 Resume optimization
- 📊 ATS-friendly resume improvement

# 🔮 Future Enhancements

Possible future improvements include:

- 📊 Resume section-wise scoring
- 📑 Multiple resume comparison
- 💼 Job recommendation system
- ✍️ Resume formatting suggestions
- 🔗 LinkedIn profile analysis
- 🤖 Multiple AI model support
- 📄 Resume template generation
- 🔐 Authentication and user accounts
- ☁️ Cloud-based analysis history
- 🧠 Advanced ATS scoring algorithms

# 📈 Project Highlights

- ✅ Built a full-stack AI-powered web application
- ✅ Integrated Groq API for AI-based resume analysis
- ✅ Implemented PDF resume text extraction
- ✅ Created an ATS scoring dashboard
- ✅ Added keyword matching functionality
- ✅ Implemented missing skill detection
- ✅ Added downloadable PDF analysis reports
- ✅ Implemented analysis history using browser Local Storage
- ✅ Added Light/Dark mode
- ✅ Designed responsive UI for desktop, tablet, and mobile
- ✅ Deployed frontend using Vercel
- ✅ Deployed backend using Render
- ✅ Maintained source code using Git and GitHub

# 🧪 Testing

The application was tested for:

- ✅ Resume text input
- ✅ Job description input
- ✅ PDF upload
- ✅ PDF text extraction
- ✅ AI resume analysis
- ✅ ATS score generation
- ✅ Keyword matching
- ✅ Missing skill detection
- ✅ Strength identification
- ✅ Improvement suggestions
- ✅ PDF report generation
- ✅ Analysis history
- ✅ Light/Dark mode
- ✅ Responsive layouts
- ✅ Frontend-backend API communication

# 🌐 Deployment

## Frontend

**Platform:** Vercel

🔗 **Live Application:**  
https://ai-resume-analyzer-kappa-kohl.vercel.app/

## Backend

**Platform:** Render

🔗 **Backend API:**  
https://ai-resume-analyzer-9tmb.onrender.com/

# 👨‍💻 Developer

## A. Navaneetha

**B.Tech Artificial Intelligence & Data Science**

### Interests

- Full Stack Development
- Java Development
- React.js
- Backend Development
- AI-powered Applications

### GitHub

🔗 https://github.com/A-Navaneetha/

# 📄 License

This project is available for educational and personal use.
