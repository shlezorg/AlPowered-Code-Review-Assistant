import { useState, useEffect } from "react";
import "./App.css";

import * as Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-r";
import "prismjs/components/prism-julia";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-plsql";
import "prismjs/components/prism-haskell";
import "prismjs/components/prism-elixir";
import "prismjs/components/prism-erlang";
import "prismjs/components/prism-fsharp";
import "prismjs/components/prism-scala";

import axios from "axios";
import SimpleCodeEditorRaw from "react-simple-code-editor";

const SimpleCodeEditor =
  SimpleCodeEditorRaw.default || SimpleCodeEditorRaw;

function detectLanguage(code) {
  if (!code || code.trim() === "") return "JavaScript";
  const trimmed = code.trim();

  // HTML Check
  if (/<html|<!DOCTYPE|<body|<div|<p|<script/i.test(trimmed)) {
    return "HTML";
  }

  // CSS Check
  if (/[a-zA-Z-]+\s*\{[^}]*:[^;]+;/i.test(trimmed)) {
    return "CSS";
  }

  // PHP Check
  if (/<\?php|echo\s+['"].*['"]\s*;/i.test(trimmed)) {
    return "PHP";
  }

  // PL/SQL Check (must be checked before standard SQL)
  if (/declare\s+begin\s+/i.test(trimmed) || /exception\s+when/i.test(trimmed)) {
    return "PL/SQL";
  }

  // SQL Check
  if (/select\s+.*\s+from/i.test(trimmed) || /insert\s+into/i.test(trimmed) || /create\s+table/i.test(trimmed) || /update\s+.*\s+set/i.test(trimmed)) {
    return "SQL";
  }

  // Erlang Check
  if (/-module\s*\(/i.test(trimmed) || /-export\s*\(/i.test(trimmed)) {
    return "Erlang";
  }

  // Elixir Check
  if (/defmodule\s+\w+/i.test(trimmed) || /defp?\s+\w+\s+do/i.test(trimmed)) {
    return "Elixir";
  }

  // Haskell Check
  if (/import\s+Data\./i.test(trimmed) || /::\s*[A-Z]\w*\s*->/i.test(trimmed) || /where\s+\w+\s*=/i.test(trimmed)) {
    return "Haskell";
  }

  // F# Check
  if (/open\s+[A-Z]\w*(?:\.[A-Z]\w*)*\s*$/m.test(trimmed) || /let\s+rec\s+\w+/i.test(trimmed)) {
    return "F#";
  }

  // Scala Check
  if (/object\s+\w+\s*(?:extends|{)/i.test(trimmed) || /val\s+\w+\s*:\s*[A-Z]\w*/.test(trimmed)) {
    return "Scala";
  }

  // Julia Check
  if (/using\s+[A-Z]\w*/.test(trimmed) || (/@\w+/i.test(trimmed) && /function\s+\w+/i.test(trimmed))) {
    return "Julia";
  }

  // R Check
  if (/library\s*\(\w+\)/i.test(trimmed) || /<-\s*(?:function|c|data\.frame)\(/i.test(trimmed)) {
    return "R";
  }

  // Assembly Check
  if (/\.global\s+\w+/i.test(trimmed) || /\.section\s+\./i.test(trimmed) || /mov\s+[a-z]{3},\s*[a-z0-9]/i.test(trimmed)) {
    return "Assembly";
  }

  // Rust Check
  if (/fn\s+main\s*\(\)/i.test(trimmed) || /println!/i.test(trimmed) || /let\s+mut\s+/i.test(trimmed)) {
    return "Rust";
  }

  // Go Check
  if (/package\s+\w+/i.test(trimmed) && /import\s*\(/i.test(trimmed) && /func\s+main\s*\(\)/i.test(trimmed)) {
    return "Go";
  }

  // Ruby Check
  if (/def\s+\w+\s*[\s;]/i.test(trimmed) && /end\s*$/m.test(trimmed) && /puts\s+/i.test(trimmed)) {
    return "Ruby";
  }

  // Python Check
  if (/def\s+\w+\s*\(.*\)\s*:/i.test(trimmed) || (/import\s+\w+/i.test(trimmed) && !/from\s+['"]/i.test(trimmed))) {
    return "Python";
  }

  // C++ Check
  if (/#include\s*<\w+>/i.test(trimmed) && (/\bstd::/i.test(trimmed) || /cout\s*<</i.test(trimmed))) {
    return "C++";
  }

  // C Check
  if (/#include\s*<\w+\.h>/i.test(trimmed) || /printf\s*\(/i.test(trimmed)) {
    return "C";
  }

  // C# Check
  if (/using\s+System/i.test(trimmed) || /namespace\s+\w+/i.test(trimmed) || /Console\.WriteLine/i.test(trimmed)) {
    return "C#";
  }

  // Java Check
  if (/public\s+class\s+\w+/i.test(trimmed) || /System\.out\.println/i.test(trimmed)) {
    return "Java";
  }

  // Swift Check
  if (/import\s+UIKit/i.test(trimmed) || /import\s+Foundation/i.test(trimmed) || /func\s+\w+\s*\(.*\)\s*->\s*[A-Z]/i.test(trimmed)) {
    return "Swift";
  }

  // Kotlin Check
  if (/fun\s+main\s*\(/i.test(trimmed) || /import\s+kotlin\./i.test(trimmed)) {
    return "Kotlin";
  }

  // Dart Check
  if (/import\s+['"]package:/i.test(trimmed) || /void\s+main\s*\(\)/i.test(trimmed)) {
    return "Dart";
  }

  // TypeScript Check
  if (/: \w+/i.test(trimmed) || /interface\s+[A-Z]/i.test(trimmed) || /type\s+\w+\s*=/i.test(trimmed)) {
    return "TypeScript";
  }

  return "JavaScript";
}

// Inline SVG Icons for premium look & zero dependencies
const Icons = {
  Review: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /><line x1="8" y1="9" x2="10" y2="9" /></svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><polyline points="3 3 3 8 8 8" /><line x1="12" y1="7" x2="12" y2="12" /><line x1="12" y1="12" x2="16" y2="14" /></svg>
  ),
  Snippets: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" /></svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
  ),
  About: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
  ),
  Spark: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  ),
  Exclamation: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  ),
  Lightbulb: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /></svg>
  ),
  Flask: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12" /><path d="M9 3v8.5a6 6 0 1 0 6 0V3" /><path d="M4 18h16" /></svg>
  ),
  Moon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
  ),
  LogoIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  )
};

// SVG score circular gauge component
function ScoreGauge({ score }) {
  const roundedScore = Number(score || 0).toFixed(1);
  const percentage = Math.min(Math.max((score || 0) * 10, 0), 100);

  let color = "var(--color-success)";
  let label = "Excellent";

  if (score < 5.0) {
    color = "var(--color-error)";
    label = "Poor";
  } else if (score < 8.0) {
    color = "var(--color-warning)";
    label = "Medium";
  } else if (score < 9.0) {
    color = "var(--color-success)";
    label = "Good";
  }

  return (
    <div className="score-circle-wrapper">
      <svg viewBox="0 0 36 36" className="circular-chart">
        <path className="circle-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path className="circle-progress"
          style={{ stroke: color }}
          strokeDasharray={`${percentage}, 100`}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="circle-text">
        <span className="score-num">{roundedScore}</span>
        <span className="score-label" style={{ color }}>{label}</span>
      </div>
      <span className="score-undertext">Overall Score</span>
    </div>
  );
}

export default function App() {
  const [code, setCode] = useState(`function sum(a, b) {
  return a + b;
}`);

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Review");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [editorCopied, setEditorCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, review]);

  async function reviewCode() {
    setLoading(true);
    setError("");
    setReview(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/ai/get-review",
        { code }
      );

      let parsedData = response.data;
      if (typeof parsedData === "string") {
        try {
          parsedData = JSON.parse(parsedData);
        } catch (e) {
          console.error("JSON parsing error:", e);
        }
      }
      setReview(parsedData);
    } catch (err) {
      console.error("Review Error:", err);
      setError("❌ Failed to review code. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    if (index === "editor") {
      setEditorCopied(true);
      setTimeout(() => setEditorCopied(false), 2000);
    } else {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleClearCode = () => {
    setCode("");
  };

  const handleNewReview = () => {
    setCode(`function sum(a, b) {
  return a + b;
}`);
    setReview(null);
    setError("");
  };

  const codeLinesCount = code ? code.split("\n").length : 0;
  const language = detectLanguage(code);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo" onClick={handleNewReview}>
            <Icons.LogoIcon />
          </div>
          <nav className="menu-items">
            <button
              className={`menu-item ${activeTab === "Review" ? "active" : ""}`}
              onClick={() => setActiveTab("Review")}
              title="Review"
            >
              <Icons.Review />
              <span>Review</span>
            </button>
            <button
              className={`menu-item ${activeTab === "History" ? "active" : ""}`}
              onClick={() => setActiveTab("History")}
              title="History"
            >
              <Icons.History />
              <span>History</span>
            </button>
            <button
              className={`menu-item ${activeTab === "Snippets" ? "active" : ""}`}
              onClick={() => setActiveTab("Snippets")}
              title="Snippets"
            >
              <Icons.Snippets />
              <span>Snippets</span>
            </button>
            <button
              className={`menu-item ${activeTab === "Settings" ? "active" : ""}`}
              onClick={() => setActiveTab("Settings")}
              title="Settings"
            >
              <Icons.Settings />
              <span>Settings</span>
            </button>
          </nav>
        </div>
        <div className="sidebar-bottom" title="About" onClick={() => setActiveTab("About")}>
          <Icons.About />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-title">
            <h1>AI Code Reviewer</h1>
          </div>
          <div className="header-actions">
            <button className="action-btn">
              <Icons.Moon />
              <span>Theme</span>
            </button>
            <button className="action-btn" onClick={() => setActiveTab("History")}>
              <Icons.History />
              <span>History</span>
            </button>
            <button className="action-btn action-btn-primary" onClick={handleNewReview}>
              <Icons.Spark />
              <span>New Review</span>
            </button>
          </div>
        </header>

        {activeTab === "Review" ? (
          <div className="dashboard-body">
            {/* Left Column: Code Editor */}
            <div className="dashboard-card editor-card">
              <div className="card-header">
                <div className="card-title">
                  <Icons.LogoIcon />
                  <span>Your Code</span>
                </div>
                <span className="lang-badge">⭐ {language}</span>
              </div>
              <div className="editor-wrapper">
                <button
                  className="editor-copy-btn"
                  onClick={() => handleCopyText(code, "editor")}
                  title="Copy Code"
                >
                  {editorCopied ? (
                    <span style={{ fontSize: "0.65rem", color: "var(--color-success)" }}>Copied</span>
                  ) : (
                    <Icons.Copy />
                  )}
                </button>
                <SimpleCodeEditor
                  value={code}
                  onValueChange={setCode}
                  highlight={(code) => {
                    try {
                      const lang = detectLanguage(code);
                      let grammar = Prism.languages.javascript;
                      let prismLang = "javascript";

                      const langMap = {
                        "HTML": [Prism.languages.markup, "markup"],
                        "CSS": [Prism.languages.css, "css"],
                        "PHP": [Prism.languages.php, "php"],
                        "PL/SQL": [Prism.languages.plsql, "plsql"],
                        "SQL": [Prism.languages.sql, "sql"],
                        "Erlang": [Prism.languages.erlang, "erlang"],
                        "Elixir": [Prism.languages.elixir, "elixir"],
                        "Haskell": [Prism.languages.haskell, "haskell"],
                        "F#": [Prism.languages.fsharp, "fsharp"],
                        "Scala": [Prism.languages.scala, "scala"],
                        "Julia": [Prism.languages.julia, "julia"],
                        "R": [Prism.languages.r, "r"],
                        "Assembly": [Prism.languages.nasm || Prism.languages.clike, "clike"],
                        "Rust": [Prism.languages.rust, "rust"],
                        "Go": [Prism.languages.go, "go"],
                        "Ruby": [Prism.languages.ruby, "ruby"],
                        "Python": [Prism.languages.python, "python"],
                        "C++": [Prism.languages.cpp || Prism.languages.clike, "cpp"],
                        "C": [Prism.languages.c || Prism.languages.clike, "c"],
                        "C#": [Prism.languages.csharp || Prism.languages.clike, "csharp"],
                        "Java": [Prism.languages.java || Prism.languages.clike, "java"],
                        "Swift": [Prism.languages.swift, "swift"],
                        "Kotlin": [Prism.languages.kotlin || Prism.languages.clike, "kotlin"],
                        "Dart": [Prism.languages.dart || Prism.languages.clike, "dart"],
                        "TypeScript": [Prism.languages.typescript || Prism.languages.javascript, "typescript"],
                        "JavaScript": [Prism.languages.javascript, "javascript"]
                      };

                      if (langMap[lang]) {
                        grammar = langMap[lang][0] || Prism.languages.javascript || Prism.languages.clike;
                        prismLang = langMap[lang][1];
                      }

                      if (!grammar) {
                        return code;
                      }

                      return Prism.highlight(code, grammar, prismLang);
                    } catch (err) {
                      console.error("Syntax highlighting error:", err);
                      return code;
                    }
                  }}
                  padding={16}
                  style={{
                    fontFamily: '"Fira Code", monospace',
                    fontSize: 14,
                    color: "#fff",
                    minHeight: "100%",
                    outline: "none"
                  }}
                />
              </div>
              <div className="editor-footer">
                <div className="editor-status">
                  <span className="status-dot"></span>
                  <span>{language}</span>
                </div>
                <span>{codeLinesCount} {codeLinesCount === 1 ? 'line' : 'lines'} of code</span>
              </div>
              <div className="editor-actions">
                <button className="review-btn" onClick={reviewCode} disabled={loading}>
                  <Icons.Spark />
                  <span>{loading ? "Analyzing..." : "Review Code"}</span>
                </button>
                <button className="icon-btn-secondary" onClick={handleClearCode} title="Clear Code">
                  <Icons.Trash />
                </button>
                <button className="icon-btn-secondary" onClick={() => handleCopyText(code, "editor")} title="Copy Code">
                  <Icons.Copy />
                </button>
              </div>
            </div>

            {/* Right Column: Code Review Results */}
            <div className="dashboard-results">
              {loading && (
                <div className="dashboard-card empty-state">
                  <Icons.Spark />
                  <p>🔍 Analyzing code structures...</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Please wait while the AI analyzes logic, security, and performance.</p>
                </div>
              )}

              {error && (
                <div className="dashboard-card empty-state" style={{ borderColor: 'var(--color-error)' }}>
                  <Icons.Exclamation />
                  <p style={{ color: 'var(--color-error)' }}>{error}</p>
                </div>
              )}

              {!loading && !error && !review && (
                <div className="dashboard-card empty-state">
                  <Icons.Review />
                  <p>Ready to Analyze</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Write or paste code in the editor, and click "Review Code" to generate the review.</p>
                </div>
              )}

              {!loading && !error && review && (
                <>
                  {/* Row 1: Overall Summary */}
                  <div className="dashboard-card summary-container">
                    <div className="summary-text">
                      <h3 className="summary-title">
                        <Icons.Shield />
                        <span>Overall Summary</span>
                      </h3>
                      <p className="summary-desc">{review.overallSummary || review.summary}</p>
                    </div>
                    <ScoreGauge score={review.score} />
                  </div>

                  {/* Row 2: Strengths & Issues */}
                  <div className="middle-grid">
                    {/* Strengths */}
                    <div className="dashboard-card">
                      <div className="card-header">
                        <div className="card-title">
                          <Icons.Shield />
                          <span>Strengths</span>
                        </div>
                      </div>
                      <div className="strengths-list">
                        {review.strengths && review.strengths.map((item, idx) => (
                          <div className="strength-item" key={idx}>
                            <span className="strength-check">
                              <Icons.Check />
                            </span>
                            <div className="strength-content">
                              <h4>{item.title}</h4>
                              <p>{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Issues Found */}
                    <div className="dashboard-card">
                      <div className="card-header">
                        <div className="card-title">
                          <Icons.Exclamation />
                          <span>Issues Found</span>
                        </div>
                      </div>
                      <div className="issues-list">
                        {review.issues && review.issues.map((item, idx) => (
                          <div className="issue-card" key={idx}>
                            <div className="issue-meta">
                              <span className="issue-title">{item.title}</span>
                              <span className={`severity-badge ${item.severity?.toLowerCase() || 'medium'}`}>
                                {item.severity}
                              </span>
                            </div>
                            <div className="issue-block problem">
                              <span>Problem:</span>
                              <p>{item.problem}</p>
                            </div>
                            <div className="issue-block impact">
                              <span>Impact:</span>
                              <p>{item.impact}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Recommendations & Test Cases */}
                  <div className="middle-grid">
                    {/* Recommendations */}
                    <div className="dashboard-card recommendations-card">
                      <div className="card-header">
                        <div className="card-title">
                          <Icons.Lightbulb />
                          <span>Recommendations</span>
                        </div>
                      </div>
                      {review.issues && review.issues.map((item, idx) => (
                        <div className="rec-item" key={idx}>
                          <span className="rec-icon">
                            <Icons.Check />
                          </span>
                          <span className="rec-text">{item.recommendation}</span>
                        </div>
                      ))}

                      {review.issues && review.issues[0]?.exampleFix && (
                        <>
                          <h4 className="example-fix-title">
                            <Icons.LogoIcon />
                            <span>Example Fix</span>
                          </h4>
                          <div className="fix-card">
                            <button
                              className="editor-copy-btn"
                              onClick={() => handleCopyText(review.issues[0].exampleFix, 0)}
                              title="Copy Example Fix"
                            >
                              {copiedIndex === 0 ? (
                                <span style={{ fontSize: "0.6rem", color: "var(--color-success)" }}>Copied</span>
                              ) : (
                                <Icons.Copy />
                              )}
                            </button>
                            <pre><code>{review.issues[0].exampleFix}</code></pre>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Test Cases */}
                    <div className="dashboard-card">
                      <div className="card-header">
                        <div className="card-title">
                          <Icons.Flask />
                          <span>Test Cases</span>
                        </div>
                      </div>
                      <div className="test-cases-list">
                        {review.testCases && review.testCases.map((item, idx) => (
                          <div className={`test-case-row ${item.passed ? 'passed' : 'failed'}`} key={idx}>
                            <span className="test-input">{item.input}</span>
                            <span className={`test-result ${item.passed ? 'passed' : 'failed'}`}>
                              {item.passed ? "✅" : "❌"} {item.output} {item.expected && !item.passed && `(expected: ${item.expected})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="dashboard-card empty-state" style={{ height: '70%' }}>
            <Icons.Snippets />
            <h3>{activeTab} Page</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>This page is coming soon in the next version of the assistant.</p>
          </div>
        )}
      </main>
    </div>
  );
}