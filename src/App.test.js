import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TakeCart heading', () => {
  render(<App />);
  const heading = screen.getByText(/TakeCart/i);
  expect(heading).toBeInTheDocument();
});
