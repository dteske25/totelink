import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from './Layout';

vi.mock('./Navbar', () => ({ Navbar: () => <div>Nav</div> }));
vi.mock('@tanstack/react-router', () => ({
  Outlet: () => <div>Outlet content</div>,
}));

describe('Layout', () => {
  it('renders navbar and outlet', () => {
    render(<Layout />);
    expect(screen.getByText('Nav')).toBeInTheDocument();
    expect(screen.getByText('Outlet content')).toBeInTheDocument();
  });
});
