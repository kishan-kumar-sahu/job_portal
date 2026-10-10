import { SectionHeader } from "../shared/PagePrimitives.jsx";

export default function ResumePage({
  file,
  setFile,
  onSubmit,
  analysis,
  busy,
}) {
  return (
    <div className="section-page">
      <SectionHeader
        eyebrow="AI CAREER STUDIO"
        title="Your resume, with a second opinion"
        description="Get practical feedback on your strengths, skills gaps, and next steps."
      />
      <div className="resume-layout">
        <div className="resume-upload-panel panel">
          <div className="ai-badge">
            <span>✦</span> POWERED BY GROQ AI
          </div>
          <h2>
            Make your experience
            <br />
            <em>impossible to miss.</em>
          </h2>
          <p>
            Upload a resume and get a structured analysis in seconds. Your file
            is processed for this request and the result is shown here.
          </p>
          <form onSubmit={onSubmit}>
            <label className={`dropzone ${file ? "has-file" : ""}`}>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <span className="upload-icon">{file ? "✓" : "↑"}</span>
              <strong>{file ? file.name : "Drop your resume here"}</strong>
              <small>
                {file
                  ? `${(file.size / 1024).toFixed(0)} KB · Ready to analyze`
                  : "or click to browse · PDF or DOCX · max 5 MB"}
              </small>
              <span className="browse-link">
                {file ? "Choose a different file" : "Browse files"}
              </span>
            </label>
            <button
              className="btn btn-primary btn-full"
              disabled={busy || !file}
            >
              {busy ? (
                <>
                  <span className="spinner" /> Analyzing resume…
                </>
              ) : (
                <>
                  Analyze my resume <span>✦</span>
                </>
              )}
            </button>
          </form>
          <div className="privacy-note">
            <span>♧</span> Keep it professional. Don’t upload sensitive
            information you don’t need analyzed.
          </div>
        </div>
        <div className="resume-side">
          <div className="resume-tip panel">
            <div className="tip-icon">✧</div>
            <h3>What you’ll get</h3>
            <div className="tip-row">
              <span>01</span>
              <div>
                <strong>Resume score</strong>
                <p>A high-level snapshot of your current resume.</p>
              </div>
            </div>
            <div className="tip-row">
              <span>02</span>
              <div>
                <strong>Skills & experience</strong>
                <p>Extracted skills and experience highlights.</p>
              </div>
            </div>
            <div className="tip-row">
              <span>03</span>
              <div>
                <strong>Actionable improvements</strong>
                <p>Strengths, gaps, and practical next steps.</p>
              </div>
            </div>
          </div>
          <div className="resume-note">
            <span>✦</span>
            <p>
              <strong>A helpful guide, not a verdict.</strong>
              <br />
              AI feedback can miss context. Use it as one input while you shape
              your story.
            </p>
          </div>
        </div>
      </div>
      {analysis && <ResumeResults analysis={analysis} />}
    </div>
  );
}

function ResumeResults({ analysis }) {
  const score = Math.max(0, Math.min(100, Number(analysis.score || 0)));
  return (
    <div className="analysis-results">
      <div className="results-title">
        <div>
          <div className="eyebrow eyebrow-dark">YOUR ANALYSIS</div>
          <h2>Here’s your resume snapshot</h2>
        </div>
        <span className="analysis-complete">✓ Analysis complete</span>
      </div>
      <div className="analysis-grid">
        <div className="panel score-panel">
          <div
            className="score-ring"
            style={{ "--score": `${score * 3.6}deg` }}
          >
            <div>
              <strong>{score}</strong>
              <small>/100</small>
            </div>
          </div>
          <h3>Resume score</h3>
          <p>{analysis.summary || "A high-level overview of your resume."}</p>
        </div>
        <div className="panel analysis-card">
          <h3>
            Strengths <span className="positive">↗</span>
          </h3>
          <ul>
            {(analysis.strengths || []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="panel analysis-card">
          <h3>
            Skills found{" "}
            <span className="count-badge">
              {(analysis.skills || []).length}
            </span>
          </h3>
          <div className="skill-chips">
            {(analysis.skills || []).map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
        <div className="panel analysis-card">
          <h3>
            Skills to explore{" "}
            <span className="count-badge">
              {(analysis.missingSkills || []).length}
            </span>
          </h3>
          <div className="skill-chips muted-chips">
            {(analysis.missingSkills || []).map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
        <div className="panel analysis-card">
          <h3>Areas to improve</h3>
          <ul>
            {(analysis.weaknesses || []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="panel analysis-card">
          <h3>
            Suggested next steps <span className="positive">✦</span>
          </h3>
          <ol>
            {(analysis.suggestions || []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
