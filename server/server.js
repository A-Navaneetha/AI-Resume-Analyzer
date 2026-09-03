const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");
const multer = require("multer");
const pdfParse = require("pdf-parse");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Configure Multer for PDF file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    }
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        message: "AI Resume Analyzer API is running"
    });
});

// Extract text from PDF resume endpoint
app.post("/api/extract-pdf", upload.single("resume"), async (req, res) => {
  try {
    console.log("PDF upload received");

    if (!req.file) {
      return res.status(400).json({
        error: "Please upload a PDF resume"
      });
    }

    console.log("File:", req.file.originalname);
    console.log("Size:", req.file.size);
    console.log("Type:", req.file.mimetype);

    const data = await pdfParse(req.file.buffer);

    console.log("Extracted characters:", data.text.length);

    if (!data.text || !data.text.trim()) {
      return res.status(400).json({
        error: "Could not extract text from this PDF. The PDF may be scanned/image-based."
      });
    }

    return res.status(200).json({
      text: data.text.trim()
    });

  } catch (error) {
    console.error("PDF extraction error:", error);

    return res.status(500).json({
      error: "Failed to extract text from PDF",
      details: error.message
    });
  }
});

// Analyze resume against job description endpoint
app.post("/api/analyze-resume", async (req, res) => {
    try {
        const { resume, jobDescription } = req.body;

        if (!resume || !jobDescription) {
            return res.status(400).json({
                error: "Both resume and job description are required"
            });
        }
        console.log("🚀 Sending resume to Groq...");
        console.log("Resume length:", resume.length);
        console.log("Job description length:", jobDescription.length);

        const completion = await groq.chat.completions.create({
            model: "qwen/qwen3.8-27b",
            messages: [
                {
                    role: "user",
                    content: `
Analyze the resume against the job description.

Return ONLY the required JSON structure.

Keep every array short:
- matchingSkills: maximum 5 items
- missingSkills: maximum 5 items
- strengths: maximum 3 items
- suggestions: maximum 3 items

ATS score must be a number from 0 to 100.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}
`
                }
            ],
            temperature: 0.3,
            max_completion_tokens: 800,
            reasoning_effort: "none",
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "resume_analysis",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            atsScore: {
                                type: "number"
                            },
                            matchingSkills: {
                                type: "array",
                                items: {
                                    type: "string"
                                },
                                maxItems: 8
                            },
                            missingSkills: {
                                type: "array",
                                items: {
                                    type: "string"
                                },
                                maxItems: 8
                            },
                            strengths: {
                                type: "array",
                                items: {
                                    type: "string"
                                },
                                maxItems: 5
                            },
                            suggestions: {
                                type: "array",
                                items: {
                                    type: "string"
                                },
                                maxItems: 5
                            }
                        },
                        required: [
                            "atsScore",
                            "matchingSkills",
                            "missingSkills",
                            "strengths",
                            "suggestions"
                        ],
                        additionalProperties: false
                    }
                }
            }
        });

        const responseText = completion.choices[0].message.content;
        let analysis;

        try {
            analysis = JSON.parse(responseText);
        } catch (error) {
            console.error("Invalid JSON from AI:", responseText);
            return res.status(500).json({
                error: "AI returned an invalid response structure"
            });
        }

        return res.json(analysis);

    } catch (error) {
        console.error("Analysis error:", error);
        return res.status(500).json({
            error: "Failed to analyze resume"
        });
    }
});
console.log("✅ Groq response received");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});