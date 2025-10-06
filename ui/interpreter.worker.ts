// Web Worker for Misty interpreter execution
import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

interface WorkerMessage {
  type: 'RUN_CODE';
  code: string;
  id: number;
}

interface WorkerResponse {
  type: 'SUCCESS' | 'ERROR' | 'READY' | 'STARTED' | 'PROGRESS';
  id?: number;
  result?: string;
  error?: string;
  message?: string;
}

// Listen for messages from main thread
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, code, id } = event.data;

  if (type === 'RUN_CODE') {
    // Notify main thread that execution has started
    self.postMessage({
      type: 'STARTED',
      id,
      message: 'Starting code execution...',
    });

    try {
      // Lexical analysis
      self.postMessage({
        type: 'PROGRESS',
        id,
        message: 'Tokenizing code...',
      });
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();

      // Parsing
      self.postMessage({
        type: 'PROGRESS',
        id,
        message: 'Parsing AST...',
      });
      const parser = new Parser(tokens);
      const ast = parser.parse();

      // Interpretation
      self.postMessage({
        type: 'PROGRESS',
        id,
        message: 'Executing code...',
      });
      const interpreter = new Interpreter();
      const result = interpreter.interpret(ast);

      // Send success response back to main thread
      self.postMessage({
        type: 'PROGRESS',
        id,
        message: 'Execution completed successfully',
      });

      const response: WorkerResponse = {
        type: 'SUCCESS',
        id,
        result: result || '(No output)',
      };
      self.postMessage(response);
    } catch (err) {
      // Send error response back to main thread
      const response: WorkerResponse = {
        type: 'ERROR',
        id,
        error: err instanceof Error ? err.message : String(err),
      };
      self.postMessage(response);
    }
  }
};

// Signal that worker is ready
console.log('[Web Worker] Misty interpreter worker initialized');
self.postMessage({
  type: 'READY',
  message: 'Web Worker ready to execute Misty code',
});
