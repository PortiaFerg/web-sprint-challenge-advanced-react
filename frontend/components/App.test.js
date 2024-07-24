import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AppFunctional from './AppFunctional';

test('Active Square should be index 1 after moving up from index 4', () => {
  render(<AppFunctional />);
  
  // Move up from initial index 4
  const upButton = screen.getByText('UP');
  fireEvent.click(upButton);

  // Check if the active square is now at index 1
  const activeSquare = screen.getByText('B');
  expect(activeSquare).toHaveClass('square active');
  expect(activeSquare.parentElement).toHaveAttribute('data-testid', 'square-1');
});

test('renders coordinates and steps', () => {
  render(<AppFunctional />);
  expect(screen.getByText(/Coordinates \(2, 2\)/)).toBeInTheDocument();
  expect(screen.getByText(/You moved 0 times/)).toBeInTheDocument();
});

test('typing in input updates value', () => {
  render(<AppFunctional />);
  const input = screen.getByPlaceholderText('type email');
  fireEvent.change(input, { target: { value: 'test@example.com' } });
  expect(input.value).toBe('test@example.com');
});

test('clicking buttons moves the grid', () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText('RIGHT'));
  expect(screen.getByText(/Coordinates \(3, 2\)/)).toBeInTheDocument();
  fireEvent.click(screen.getByText('DOWN'));
  expect(screen.getByText(/Coordinates \(3, 3\)/)).toBeInTheDocument();
  fireEvent.click(screen.getByText('LEFT'));
  expect(screen.getByText(/Coordinates \(2, 3\)/)).toBeInTheDocument();
  fireEvent.click(screen.getByText('UP'));
  expect(screen.getByText(/Coordinates \(2, 2\)/)).toBeInTheDocument();
});

test('reset button resets the grid', () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText('RIGHT'));
  fireEvent.click(screen.getByText('reset'));
  expect(screen.getByText(/Coordinates \(2, 2\)/)).toBeInTheDocument();
  expect(screen.getByText(/You moved 0 times/)).toBeInTheDocument();
});

test('form submission shows success or error message', async () => {
  render(<AppFunctional />);
  const input = screen.getByPlaceholderText('type email');
  fireEvent.change(input, { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => screen.findByText(/success/i)); // Adjust based on expected success message
});

test('Steps counter handles a single step gracefully', () => {
  render(<AppFunctional />);

  const upButton = screen.getByText('UP');
  fireEvent.click(upButton);

  expect(screen.getByText(/You moved 1 time/)).toBeInTheDocument();

  fireEvent.click(screen.getByText('reset'));
  expect(screen.getByText(/You moved 0 times/)).toBeInTheDocument();
});


