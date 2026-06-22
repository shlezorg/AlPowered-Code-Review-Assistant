import { useState } from "react";
import "./App.css";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import SimpleCodeEditor from "react-simple-code-editor";

// JavaScript language support
import "prismjs/components/prism-javascript";

export default function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);

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
                Prism.languages.javascript || {},
                "javascript"
              )
            }
            padding={12}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "10px",
              height: "100%",
              width: "100%",
              outline: "none",
            }}
          />
        </div>

        <button className="review">Review</button>
      </div>

      <div className="right">
        <h2>Output / Review Panel</h2>
      </div>
    </main>
  );
}