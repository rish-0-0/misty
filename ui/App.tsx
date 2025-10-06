import { useState } from 'preact/hooks';
import { Editor } from './Editor';
import { Output } from './Output';
import { useInterpreterWorker } from './useInterpreterWorker';

const defaultCode = `# Misty - Full Feature Demo

# Variables & Procedures
const x = 5;
mut a = 4;

procedure multiply(a, b) {
  returns a * b;
}

# Objects (JSON-like syntax)
const person = {
  name: "Alice",
  age: 30,
  city: "NYC"
};

System.out.console("Name: " + person.name);
System.out.console("Age: " + person.age);

# Dynamic property access with arrow operator
const key = "city";
System.out.console("City: " + person->key);

# Null and NaN
const nullable = null;
const notANumber = NaN;

incase (nullable == null) {
  System.out.console("nullable is null");
}

# Assignment & Conditionals
a = multiply(x, a);
System.out.console("Result: " + a);

incase (a > 10) {
  System.out.console("a is greater than 10");
}

# Drift Loop (Traditional)
mut sum = 0;
drift (mut i = 0; i < 5; i = i + 1) {
  sum = sum + i;
}
System.out.console("Sum 0-4: " + sum);

# Arrays & Drift-Through Loop
const arr = [10, 20, 30];
drift (const num through arr) {
  System.out.console("Number: " + num);
}`;

export function App(): JSX.Element {
  const [code, setCode] = useState(defaultCode);
  const {
    runCode: runCodeInWorker,
    cancelExecution,
    output,
    error,
    isRunning,
    isReady,
    notification,
  } = useInterpreterWorker();

  const runCode = (): void => {
    runCodeInWorker(code);
  };

  return (
    <div class="app">
      <header class="header">
        <h1>🌫️ Misty</h1>
        <p>A simple programming language running in Web Workers</p>
      </header>

      {notification && (
        <div class="notification">
          {notification}
        </div>
      )}

      <div class="container">
        <div class="editor-section">
          <div class="section-header">
            <h2>Code Editor</h2>
            <div class="button-group">
              <button onClick={runCode} class="run-button" disabled={isRunning || !isReady}>
                {isRunning ? '⏳ Running...' : isReady ? '▶ Run' : '⏳ Loading...'}
              </button>
              {isRunning && (
                <button onClick={cancelExecution} class="cancel-button">
                  🛑 Cancel
                </button>
              )}
            </div>
          </div>
          <Editor value={code} onChange={setCode} />
        </div>

        <div class="output-section">
          <h2>Output</h2>
          <Output output={output} error={error} />
        </div>
      </div>

      <footer class="footer">
        <p>
          Misty Language v0.1.0 | Built with Web Workers & Preact
        </p>
      </footer>
    </div>
  );
}
