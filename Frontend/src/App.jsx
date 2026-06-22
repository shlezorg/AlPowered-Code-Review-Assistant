import { useState } from "react";
import "./App.css";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import SimpleCodeEditor from "react-simple-code-editor";

// IMPORTANT: Import clike before javascript to resolve the white screen crash
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

// Simple helper to parse basic markdown to styled HTML elements
function parseMarkdown(text) {
  if (!text) return "";
  
  let html = text
    // Escape HTML to prevent XSS
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks: ```lang ... ```
  html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang || 'javascript'}">${code.trim()}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold text: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Bullet points
  const lines = html.split("\n");
  let inList = false;
  const processedLines = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      if (!inList) {
        processedLines.push("<ul>");
        inList = true;
      }
      processedLines.push(`<li>${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        processedLines.push("</ul>");
        inList = false;
      }
      if (trimmed && !trimmed.startsWith("<h") && !trimmed.startsWith("<pre") && !trimmed.startsWith("</pre") && !trimmed.startsWith("<code") && !trimmed.startsWith("</code") && !trimmed.startsWith("<ul>") && !trimmed.startsWith("</ul>") && !trimmed.startsWith("<li>") && !trimmed.startsWith("</li>")) {
        processedLines.push(`<p>${trimmed}</p>`);
      } else {
        processedLines.push(line);
      }
    }
  }
  if (inList) {
    processedLines.push("</ul>");
  }

  return processedLines.join("\n");
}

const Editor = typeof SimpleCodeEditor === "function"
  ? SimpleCodeEditor
  : (SimpleCodeEditor.default || SimpleCodeEditor);

export default function App() {
  const [code, setCode] = useState(`// Paste your JavaScript code here for review
function calculateAverage(nums) {
  let sum = 0;
  // Bug: index out of bounds due to <= comparison
  for (var i = 0; i <= nums.length; i++) {
    sum += nums[i];
  }
  return sum / nums.length;
}`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setReview("");
    
    try {
      const response = await fetch("/api/ai/get-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Server returned status ${response.status}`);
      }
      
      const data = await response.text();
      setReview(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch review from the AI assistant.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, setCopiedState) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">✨</div>
          <span className="logo-text">AI Code Review Assistant</span>
        </div>
        <div className="header-status">
          <span className="status-dot"></span>
          <span>AI Engine Connected</span>
        </div>
      </header>

      <div className="workspace">
        {/* Left Pane - Editor */}
        <section className="pane">
          <header className="pane-header">
            <div className="pane-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              Source Code (JavaScript)
            </div>
            <div className="pane-actions">
              <button 
                onClick={() => copyToClipboard(code, setCopiedCode)} 
                className="btn-icon" 
                title="Copy code"
                disabled={!code}
              >
                {copiedCode ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
              <button 
                onClick={handleReview} 
                disabled={loading || !code.trim()}
                className="btn btn-primary"
              >
                {loading ? "Analyzing..." : "Review Code"}
              </button>
            </div>
          </header>
          
          <div className="code-editor-container">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) => {
                try {
                  return Prism.highlight(
                    code,
                    Prism.languages.javascript || {},
                    "javascript"
                  );
                } catch (err) {
                  console.error("Error highlighting code:", err);
                  return code; // Fallback to unhighlighted code if Prism fails
                }
              }}
              padding={16}
              style={{
                fontFamily: '"Fira Code", "Courier New", monospace',
                fontSize: 14,
                backgroundColor: "transparent",
                color: "#e2e8f0",
                minHeight: "100%",
                width: "100%",
              }}
            />
          </div>
        </section>

        {/* Right Pane - Review Panel */}
        <section className="pane">
          <header className="pane-header">
            <div className="pane-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Analysis & Review
            </div>
            {review && !loading && (
              <div className="pane-actions">
                <button 
                  onClick={() => copyToClipboard(review, setCopiedReview)} 
                  className="btn btn-secondary"
                  title="Copy review output"
                >
                  {copiedReview ? "Copied!" : "Copy Review"}
                </button>
              </div>
            )}
          </header>
          
          <div className="review-container">
            {loading ? (
              <div className="loading-state">
                <div className="shimmer-card">
                  <div className="shimmer-line title"></div>
                  <div className="shimmer-line"></div>
                  <div className="shimmer-line short"></div>
                </div>
                <div className="shimmer-card">
                  <div className="shimmer-line title"></div>
                  <div className="shimmer-line"></div>
                  <div className="shimmer-line short"></div>
                </div>
                <div className="shimmer-card">
                  <div className="shimmer-line title"></div>
                  <div className="shimmer-line"></div>
                </div>
              </div>
            ) : error ? (
              <div className="empty-state">
                <div className="empty-icon">⚠️</div>
                <div className="empty-title" style={{ color: 'var(--color-error)' }}>Review Error</div>
                <div className="empty-desc">{error}</div>
                <button onClick={handleReview} className="btn btn-primary">Try Again</button>
              </div>
            ) : review ? (
              <div 
                className="review-content"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(review) }}
              />
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🤖</div>
                <div className="empty-title">Ready for Review</div>
                <div className="empty-desc">
                  Write or paste your code on the left editor panel, then click "Review Code" to trigger AI analysis.
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}