import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.alert = jest.fn();
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    });
  });

  test('renders the loading state while detecting the location', () => {
    render(<App />);

    expect(screen.getByText(/Detecting your location/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Your current location wil be displayed on the App/i)
    ).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith('Geolocation not available');
  });
});
