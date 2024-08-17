import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import AppFunctional from './AppFunctional';
jest.mock('axios');

test('Active Square should be index 1 after moving up from index 4', () => {
  render(<AppFunctional />);
  
  // Move up from initial index 4
  const upButton = screen.getByText('UP');
  fireEvent.click(upButton);

  // Check if the active square is now at index 1
  const squareElement = screen.getByTestId('square-1');

  expect(squareElement).toHaveClass('square active');
});


test('renders coordinates and steps', () => {
  render(<AppFunctional />);
  expect(screen.getByText(/Coordinates \(2, 2\)/)).toBeInTheDocument();
  expect(screen.getByText(/You moved 0 time/)).toBeInTheDocument();
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
  expect(screen.getByText(/You moved 0 time/)).toBeInTheDocument();
});

test('form submission shows success or error message', async () => {
  axios.post.mockResolvedValueOnce({ data: { message: 'Success!' } });

  render(<AppFunctional />);
  const input = screen.getByPlaceholderText('type email');
  fireEvent.change(input, { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByText('submit'));
  expect(await screen.findByText(/success/i)).toBeInTheDocument()
});


test('Steps counter handles a single step gracefully', () => {
  render(<AppFunctional />);

  const upButton = screen.getByText('UP');
  fireEvent.click(upButton);

  expect(screen.getByText(/You moved 1 time/)).toBeInTheDocument();

  fireEvent.click(screen.getByText('reset'));
  expect(screen.getByText(/You moved 0 time/)).toBeInTheDocument();
});


