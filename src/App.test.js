import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TakeCart brand in navbar', () => {
  render(<App />);
  // Both the Navbar and Footer contain "TakeCart"; verify at least one is present
  const elements = screen.getAllByText(/TakeCart/i);
  expect(elements.length).toBeGreaterThan(0);
  expect(elements[0]).toBeInTheDocument();
});
