import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar';

vi.mock('./AuthButton', () => ({ default: () => <div>Auth</div> }));
vi.mock('./ThemePicker', () => ({ ThemePicker: () => <div>Theme</div> }));
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Totelink')).toBeInTheDocument();
    expect(screen.getAllByText('List')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Scan')[0]).toBeInTheDocument();
  });
});
