import { render } from 'preact';
import { App } from './App';
import './style.css';

const appElement = document.getElementById('app');
if (appElement) {
  render(<App />, appElement);
}
