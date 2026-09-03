import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "./App.css";

function App() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [history, setHistory] = useState(() => {
  try {
    const savedHistory = localStorage.getItem("resumeAnalysisHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch (error) {
    console.error("Failed to load analysis history:", error);
    return [];
  }
});
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);

useEffect(() => {
  localStorage.setItem(
    "resumeAnalysisHistory",
    JSON.stringify(history)
  );
}, [history]);

  // =========================
  // PDF UPLOAD FUNCTION
  // =========================
  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("PDF size must be less than 5 MB.");
      return;
    }

    setPdfLoading(true);
    setPdfName(file.name);
    setError("");

    try {
      const formData = new FormData();

      formData.append("resume", file);

      const response = await fetch(
        "http://localhost:5000/api/extract-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to extract PDF"
        );
      }

      setResume(data.text);

    } catch (error) {
      console.error("PDF upload error:", error);

      setError(
        error.message || "Failed to process PDF"
      );

      setPdfName("");

    } finally {
      setPdfLoading(false);
    }
  };

  // =========================
  // ANALYZE RESUME FUNCTION
  // =========================
 const analyzeResume = async () => {
  if (!resume.trim() || !jobDescription.trim()) {
    setError("Please enter both your resume and job description.");
    return;
  }

  setLoading(true);
  setError("");
  setAnalysis(null);

  try {
    const response = await fetch(
      "http://localhost:5000/api/analyze-resume",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume,
          jobDescription,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to analyze resume");
    }

    // Set current analysis
    setAnalysis(data);

    // Save analysis to history
    const historyItem = {
      id: Date.now(),
      atsScore: data.atsScore,
      matchingSkills: data.matchingSkills || [],
      missingSkills: data.missingSkills || [],
      strengths: data.strengths || [],
      suggestions: data.suggestions || [],
      jobDescription: jobDescription,
      date: new Date().toLocaleString(),
    };

    setHistory((prevHistory) => [
      historyItem,
      ...prevHistory,
    ].slice(0, 10));

  } catch (error) {
    console.error("Analysis error:", error);
    setError(error.message || "Failed to analyze resume");
  } finally {
    setLoading(false);
  }
};
  
const downloadPDF = () => {
  if (!analysis) return;

  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = 20;

  

  // ---------- Header ----------
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("AI Resume Analysis Report", 15, 18);

  y = 40;

  // ---------- Date ----------
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const date = new Date().toLocaleString();

  doc.text(`Generated: ${date}`, 15, y);

  y += 15;

  // ---------- ATS Score ----------
  doc.setFillColor(240, 247, 255);
  doc.roundedRect(15, y, pageWidth - 30, 32, 4, 4, "F");

  doc.setTextColor(37, 99, 235);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(`${analysis.atsScore}%`, 22, y + 20);

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(14);
  doc.text("ATS Compatibility Score", 55, y + 14);

  const matchText =
    analysis.atsScore >= 80
      ? "Excellent Match"
      : analysis.atsScore >= 60
      ? "Good Match"
      : analysis.atsScore >= 40
      ? "Average Match"
      : "Poor Match";

  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text(matchText, 55, y + 22);

  y += 45;

  // ---------- Helper ----------
  const addSection = (title, items) => {
    if (y > pageHeight - 45) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text(title, 15, y);

    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    if (!items || items.length === 0) {
      doc.setTextColor(100, 100, 100);
      doc.text("No data available.", 20, y);
      y += 10;
      return;
    }

    items.forEach((item, index) => {
      if (y > pageHeight - 25) {
        doc.addPage();
        y = 20;
      }

      const lines = doc.splitTextToSize(
        `• ${item}`,
        pageWidth - 40
      );

      doc.setTextColor(50, 50, 50);
      doc.text(lines, 20, y);

      y += lines.length * 7 + 3;
    });

    y += 5;
  };

  // ---------- Sections ----------
  addSection("Matching Skills", analysis.matchingSkills);
  addSection("Missing Skills", analysis.missingSkills);
  addSection("Strengths", analysis.strengths);
  addSection(
    "Improvement Suggestions",
    analysis.suggestions
  );

  // ---------- Footer ----------
  if (y > pageHeight - 20) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(220, 220, 220);
  doc.line(15, pageHeight - 18, pageWidth - 15, pageHeight - 18);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Generated by AI Resume Analyzer",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // ---------- Save ----------
  doc.save("AI_Resume_Analysis_Report.pdf");
};

 const resetAnalysis = () => {
    setResume("");
    setJobDescription("");
    setAnalysis(null);
    setError("");
    setPdfName("");
    setPdfLoading(false);
    setLoading(false);
  };
  const getKeywordAnalysis = () => {
  if (!resume || !jobDescription) {
    return {
      matchPercentage: 0,
      matchedKeywords: [],
      missingKeywords: [],
    };
  }

  const resumeText = resume.toLowerCase();
  const jobText = jobDescription.toLowerCase();

  // Common words that should not be treated as skills/keywords
  const stopWords = new Set([
    "the", "and", "or", "a", "an", "to", "of", "in", "for",
    "with", "on", "at", "by", "from", "as", "is", "are",
    "be", "will", "should", "must", "have", "has", "had",
    "this", "that", "these", "those", "we", "you", "our",
    "your", "their", "they", "who", "what", "when", "where",
    "work", "working", "job", "role", "team", "candidate",
    "experience", "skills", "knowledge", "ability",
    "years", "year", "responsibilities", "requirements"
  ]);

  // Extract words from the job description
  const words = jobText
    .replace(/[^a-z0-9+#.]/g, " ")
    .split(/\s+/)
    .filter((word) => {
      return word.length > 2 && !stopWords.has(word);
    });

  // Remove duplicate keywords
  const uniqueKeywords = [...new Set(words)];

  const matchedKeywords = uniqueKeywords.filter((keyword) =>
    resumeText.includes(keyword)
  );

  const missingKeywords = uniqueKeywords.filter(
    (keyword) => !resumeText.includes(keyword)
  );

  const matchPercentage =
    uniqueKeywords.length > 0
      ? Math.round(
          (matchedKeywords.length / uniqueKeywords.length) * 100
        )
      : 0;

  return {
    matchPercentage,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 15),
  };
};
const keywordAnalysis = getKeywordAnalysis();
  return (
    <div className={darkMode ? "app dark-theme" : "app"}>

      {/* =========================
          HEADER
      ========================= */}
      <header className="header">
  <div className="header-content">
    <h1>🤖 AI Resume Analyzer</h1>
    <p>
      Analyze your resume against a job description using AI
    </p>
  </div>

  <button
    className="theme-toggle"
    onClick={() => setDarkMode(!darkMode)}
    aria-label="Toggle theme"
  >
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>
</header>


      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="container">

        <section className="input-section">

          {/* =========================
              RESUME
          ========================= */}
          <div className="input-card">

            <h2 className="resume-title">📄 Your Resume</h2>

            {/* PDF Upload */}
            <div className="upload-section">

              <label
                htmlFor="resume-pdf"
                className="upload-button"
              >
                📄 Upload Resume PDF
              </label>

              <input
                id="resume-pdf"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePDFUpload}
                style={{ display: "none" }}
              />

              {pdfLoading && (
                <p>
                  ⏳ Extracting resume text...
                </p>
              )}

              {pdfName && !pdfLoading && (
                <p>
                  ✅ {pdfName} uploaded successfully
                </p>
              )}

            </div>

            <p className="or-text">
              OR paste your resume below
            </p>

            {/* Resume Text */}
            <textarea
              placeholder="Paste your resume here..."
              value={resume}
              onChange={(e) =>
                setResume(e.target.value)
              }
            />

            <p className="character-count">
              {resume.length} characters
            </p>

          </div>


          {/* =========================
              JOB DESCRIPTION
          ========================= */}
          <div className="input-card">

           <h2 className="job-title">💼 Job Description</h2>
            <textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
            />

            <p className="character-count">
              {jobDescription.length} characters
            </p>

          </div>

        </section>


        {/* =========================
            ANALYZE BUTTON
        ========================= */}
        <button
          className="analyze-button"
          onClick={analyzeResume}
          disabled={loading || pdfLoading}
        >
          {loading
            ? "⏳ Analyzing..."
            : "🚀 Analyze Resume"}
        </button>


        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="error">
            ❌ {error}
          </div>
        )}


        {/* =========================
            RESULTS
        ========================= */}
        {analysis && (
          <section className="results">

            <section className="keyword-analysis">
  <div className="keyword-header">
    <div>
      <h2>🔍 Keyword Match Analysis</h2>
      <p>
        Keywords from the job description found in your resume
      </p>
    </div>

    <div className="keyword-score">
      {keywordAnalysis.matchPercentage}%
    </div>
  </div>

  <div className="keyword-progress">
    <div
      className="keyword-progress-fill"
      style={{
        width: `${keywordAnalysis.matchPercentage}%`,
      }}
    ></div>
  </div>

  <div className="keyword-stats">
    <div className="keyword-stat matched-stat">
      <span className="keyword-number">
        {keywordAnalysis.matchedKeywords.length}
      </span>
      <span>Matched Keywords</span>
    </div>

    <div className="keyword-stat missing-stat">
      <span className="keyword-number">
        {keywordAnalysis.missingKeywords.length}
      </span>
      <span>Missing Keywords</span>
    </div>
  </div>

  <div className="keyword-lists">

    <div className="keyword-list-card">
      <h3>✅ Found in Resume</h3>

      {keywordAnalysis.matchedKeywords.length > 0 ? (
        <div className="keyword-badges">
          {keywordAnalysis.matchedKeywords.map(
            (keyword, index) => (
              <span
                className="keyword-badge found"
                key={index}
              >
                ✓ {keyword}
              </span>
            )
          )}
        </div>
      ) : (
        <p>No important keywords found.</p>
      )}
    </div>

    <div className="keyword-list-card">
      <h3>⚠️ Missing from Resume</h3>

      {keywordAnalysis.missingKeywords.length > 0 ? (
        <div className="keyword-badges">
          {keywordAnalysis.missingKeywords.map(
            (keyword, index) => (
              <span
                className="keyword-badge missing-keyword"
                key={index}
              >
                + {keyword}
              </span>
            )
          )}
        </div>
      ) : (
        <p>Excellent! No important keywords missing.</p>
      )}
    </div>

  </div>
</section>

            <div className="report-header">
  <h1>📊 Analysis Results</h1>

  <div className="report-actions">

    <button
      className="download-button"
      onClick={downloadPDF}
    >
      📥 Download PDF Report
    </button>

    <button
      className="reset-button"
      onClick={resetAnalysis}
    >
      🔄 Analyze Another Resume
    </button>

  </div>
</div>
            {/* ATS SCORE */}
            <div className="ats-dashboard">

  <div className="ats-header">
    <div>
      <h2>📊 Resume Analysis</h2>
      <p>AI-powered resume compatibility analysis</p>
    </div>
  </div>

  <div className="ats-main">

    <div className="score-circle">
      <div className="score-value">
        {analysis.atsScore}%
      </div>

      <div className="score-label">
        ATS SCORE
      </div>
    </div>

    <div className="score-info">

      <h3>
        {analysis.atsScore >= 80
          ? "Excellent Match 🎯"
          : analysis.atsScore >= 60
          ? "Good Match 👍"
          : analysis.atsScore >= 40
          ? "Average Match ⚠️"
          : "Poor Match ❌"}
      </h3>

      <p>
        {analysis.summary ||
          "Your resume has been analyzed against the job description."}
      </p>

    </div>

  </div>

  <div className="score-bar-container">

    <div className="score-bar">
      <div
        className="score-progress"
        style={{
          width: `${Math.min(
            Math.max(analysis.atsScore, 0),
            100
          )}%`
        }}
      ></div>
    </div>

    <div className="score-scale">
      <span>0</span>
      <span>25</span>
      <span>50</span>
      <span>75</span>
      <span>100</span>
    </div>

  </div>

</div>

<div className="stats-grid">

  <div className="stat-card">

    <div className="stat-icon">
      ✅
    </div>

    <div>
      <h3>
        {analysis.matchingSkills?.length || 0}
      </h3>

      <p>Matching Skills</p>
    </div>

  </div>


  <div className="stat-card">

    <div className="stat-icon">
      ⚠️
    </div>

    <div>
      <h3>
        {analysis.missingSkills?.length || 0}
      </h3>

      <p>Missing Skills</p>
    </div>

  </div>


  <div className="stat-card">

    <div className="stat-icon">
      💪
    </div>

    <div>
      <h3>
        {analysis.strengths?.length || 0}
      </h3>

      <p>Strengths</p>
    </div>

  </div>


  <div className="stat-card">

    <div className="stat-icon">
      💡
    </div>

    <div>
      <h3>
        {analysis.suggestions?.length || 0}
      </h3>

      <p>Suggestions</p>
    </div>

  </div>

</div>


            {/* RESULT GRID */}
            <div className="result-grid">
              
              {/* MATCHING SKILLS */}
              <div className="result-card skills-card">
  <h3>✅ Matching Skills</h3>

  {analysis.matchingSkills?.length > 0 ? (
    <div className="skills-container">
      {analysis.matchingSkills.map((skill, index) => (
        <span className="skill-badge matching" key={index}>
          ✓ {skill}
        </span>
      ))}
    </div>
  ) : (
    <p>No matching skills found.</p>
  )}
</div>


              {/* MISSING SKILLS */}
              

                <div className="result-card skills-card">
  <h3>⚠️ Missing Skills</h3>

  {analysis.missingSkills?.length > 0 ? (
    <div className="skills-container">
      {analysis.missingSkills.map((skill, index) => (
        <span className="skill-badge missing" key={index}>
          + {skill}
        </span>
      ))}
    </div>
  ) : (
    <p>No major missing skills.</p>
  )}
</div>


              {/* STRENGTHS */}
              <div className="result-card">
  <h3>💪 Strengths</h3>

  {analysis.strengths?.length > 0 ? (
    <div className="strength-list">
      {analysis.strengths.map((strength, index) => (
        <div className="strength-item" key={index}>
          <span>✓</span>
          <p>{strength}</p>
        </div>
      ))}
    </div>
  ) : (
    <p>No strengths found.</p>
  )}
</div>


              {/* SUGGESTIONS */}
              
                    <div className="result-card">
  <h3>💡 Improvement Suggestions</h3>

  {analysis.suggestions?.length > 0 ? (
    <div className="suggestion-list">
      {analysis.suggestions.map((suggestion, index) => (
        <div className="suggestion-item" key={index}>
          <span>{index + 1}</span>
          <p>{suggestion}</p>
        </div>
      ))}
    </div>
  ) : (
    <p>No suggestions available.</p>
  )}
</div>

            </div>

          </section>
        )}
        {history.length > 0 && (
  <section className="history-section">

    <div className="history-header">
      <div>
        <h2>📊 Analysis History</h2>
        <p>Your recent resume analysis results</p>
      </div>

      <button
        className="clear-history-button"
        onClick={() => {
          if (
            window.confirm(
              "Are you sure you want to clear all analysis history?"
            )
          ) {
            setHistory([]);
          }
        }}
      >
        🗑️ Clear History
      </button>
    </div>

    <div className="history-list">

      {history.map((item) => (

        <div className="history-card" key={item.id}>

          <div className="history-score">
            {item.atsScore}%
          </div>

          <div className="history-info">

            <h3>Resume Analysis</h3>

            <p className="history-date">
              📅 {item.date}
            </p>

            <div className="history-stats">

              <span>
                ✅ {item.matchingSkills.length} Matching
              </span>

              <span>
                ⚠️ {item.missingSkills.length} Missing
              </span>

              <span>
                💪 {item.strengths.length} Strengths
              </span>

            </div>

          </div>

          <button
            className="view-history-button"
            onClick={() => {
              setAnalysis(item);
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            }}
          >
            👁️ View
          </button>

        </div>

      ))}

    </div>

  </section>
)}

      </main>


      {/* =========================
          FOOTER
      ========================= */}
      <footer>
        <p>
          AI Resume Analyzer • Built with React + Node.js + Groq
        </p>
      </footer>

    </div>
  );
}

export default App;