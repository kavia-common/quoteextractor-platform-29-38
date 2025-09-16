import { render, screen } from '@testing-library/react';
import App from './App';

test('renders quote extraction app', () => {
  render(<App />);
  // Check for the main navigation element that's unique
  const uploadNav = screen.getByRole('tab', { name: /Upload/i });
  expect(uploadNav).toBeInTheDocument();
});

test('renders copilot button', () => {
  render(<App />);
  // Check for the copilot button
  const copilotButton = screen.getByTitle(/Open Copilot Assistant/i);
  expect(copilotButton).toBeInTheDocument();
});
