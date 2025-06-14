import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IndexRoute } from './index';

describe('Index route', () => {
  it('renders heading and button', () => {
    render(<IndexRoute />);
    expect(screen.getByRole('heading', { name: /totelink/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
  });
});
