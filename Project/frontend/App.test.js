import { render, screen } from '@testing-library/react';
import App from './App';
test('renders login and signup buttons', () => {
  render(<App />);
  
  expect(screen.getByText(/log in as user/i)).toBeInTheDocument();
  
  expect(screen.getByText(/log in as admin/i)).toBeInTheDocument();
  
  expect(screen.getByText(/sign up for user/i)).toBeInTheDocument();
});
