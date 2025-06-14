import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScanRoute } from './scan';

describe('Scan route', () => {
  it('renders simple text', () => {
    render(<ScanRoute />);
    expect(screen.getByText('Hello "/scan"!')).toBeInTheDocument();
  });
});
