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

### Project Structure 
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
│   ├── .env
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
