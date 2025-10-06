interface OutputProps {
  output: string;
  error: string;
}

export function Output({ output, error }: OutputProps): JSX.Element {
  if (error) {
    return (
      <div class="output-container error">
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <div class="output-container">
      <pre>{output || '(Run your code to see output)'}</pre>
    </div>
  );
}
