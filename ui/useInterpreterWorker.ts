import { useEffect, useRef, useState } from 'preact/hooks';

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

interface UseInterpreterWorkerResult {
  runCode: (code: string) => void;
  cancelExecution: () => void;
  output: string;
  error: string;
  isRunning: boolean;
  isReady: boolean;
  notification: string;
}

export function useInterpreterWorker(): UseInterpreterWorkerResult {
  const workerRef = useRef<Worker | null>(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [notification, setNotification] = useState('');
  const requestIdRef = useRef(0);

  const showNotification = (message: string): void => {
    console.log('[Notification]', message);
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // Clear after 3 seconds
  };

  const createWorker = (): Worker => {
    console.log('[Main Thread] Creating new Web Worker...');
    const worker = new Worker(
      new URL('./interpreter.worker.ts', import.meta.url),
      { type: 'module' }
    );

    // Handle messages from worker
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { type, result, error: workerError, message } = event.data;

      if (type === 'READY') {
        console.log('[Web Worker]', message || 'Worker ready');
        setIsReady(true);
        showNotification('✅ Worker ready');
        return;
      }

      if (type === 'STARTED') {
        console.log('[Web Worker]', message || 'Execution started');
        setIsRunning(true);
        showNotification('⏳ Executing code...');
        return;
      }

      if (type === 'PROGRESS') {
        console.log('[Web Worker]', message || 'Executing...');
        return;
      }

      if (type === 'SUCCESS') {
        console.log('[Web Worker] ✅ Execution completed successfully');
        setOutput(result || '(No output)');
        setError('');
        setIsRunning(false);
        showNotification('✅ Execution completed');
      } else if (type === 'ERROR') {
        console.error('[Web Worker] ❌ Execution failed:', workerError);
        setError(workerError || 'Unknown error');
        setOutput('');
        setIsRunning(false);
        showNotification('❌ Execution failed');
      }
    };

    // Handle worker errors
    worker.onerror = (event) => {
      console.error('[Web Worker] ❌ Worker error:', event.message);
      setError(`Worker error: ${event.message}`);
      setOutput('');
      setIsRunning(false);
      showNotification('❌ Worker error');
    };

    return worker;
  };

  useEffect(() => {
    // Create initial worker
    workerRef.current = createWorker();

    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const runCode = (code: string): void => {
    if (!workerRef.current || !isReady) {
      console.error('[Web Worker] ❌ Worker not ready');
      setError('Worker not ready');
      return;
    }

    console.log('[Main Thread] Sending code to Web Worker for execution');
    setIsRunning(true);
    setError('');
    setOutput('Running...');

    const id = requestIdRef.current++;
    const message: WorkerMessage = {
      type: 'RUN_CODE',
      code,
      id,
    };

    workerRef.current.postMessage(message);
  };

  const cancelExecution = (): void => {
    if (!workerRef.current) {
      console.warn('[Main Thread] No worker to cancel');
      return;
    }

    console.log('[Main Thread] 🛑 Cancelling execution and terminating worker...');
    showNotification('🛑 Cancelling execution...');

    // Terminate the current worker
    workerRef.current.terminate();
    setIsRunning(false);
    setIsReady(false);
    setOutput('');
    setError('Execution cancelled by user');

    // Show cancellation complete notification
    setTimeout(() => {
      showNotification('✅ Execution cancelled');
    }, 100);

    // Automatically spawn a new worker
    console.log('[Main Thread] 🔄 Spawning new worker...');
    setTimeout(() => {
      showNotification('🔄 Starting new worker...');
      workerRef.current = createWorker();
    }, 500);
  };

  return {
    runCode,
    cancelExecution,
    output,
    error,
    isRunning,
    isReady,
    notification,
  };
}
