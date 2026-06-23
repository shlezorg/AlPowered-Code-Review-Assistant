import { useState, useEffect } from "react";
import "./App.css";

import * as Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";

import Markdown from "react-markdown";
import axios from "axios";

import SimpleCodeEditorRaw from "react-simple-code-editor";

const SimpleCodeEditor =
  SimpleCodeEditorRaw.default || SimpleCodeEditorRaw;

export default function App() {
  const [code, setCode] = useState(`function sum(a, b) {
  return a + b;
}`);

  const [review, setReview] = useState("");

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
    setReview("🔍 Analyzing code...");

    try {
      const response = await axios.post(
        "http://localhost:3000/ai/get-review",
        {
          code: code,
        }
      );

      console.log(response.data);

      // CHANGE THIS LINE ACCORDING TO YOUR BACKEND RESPONSE
      setReview(response.data);
    } catch (error) {
      console.error("Review Error:", error);

      setReview(
        "❌ Failed to review code. Check if backend is running."
      );
    }
  }

  return (
    <main>
      <div className="left">
        <div className="code">
          <SimpleCodeEditor
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              Prism.highlight(
                code,
                Prism.languages.javascript,
                "javascript"
              )
            }
            padding={12}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 16,
              backgroundColor: "#000",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "10px",
              minHeight: "500px",
              width: "100%",
            }}
          />
        </div>

        <button onClick={reviewCode} className="review">
          Review
        </button>
      </div>

      <div className="right">
        <Markdown
        style={{
          fontSize:16,
        }}>{review}</Markdown>
      </div>
    </main>
  );
}