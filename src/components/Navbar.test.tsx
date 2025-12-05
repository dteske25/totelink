import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
    Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => <a href={to} className={className}>{children}</a>
}));

vi.mock('./AuthButton', () => ({
    default: () => <button>Auth Button</button>
}));

vi.mock('./ThemePicker', () => ({
    ThemePicker: () => <div data-testid="theme-picker">Theme Picker</div>
}));

describe('Navbar', () => {
    it('renders the application title link', () => {
        render(<Navbar />);
        const titleLink = screen.getByRole('link', { name: /Totelink/i });
        expect(titleLink).toBeInTheDocument();
        expect(titleLink).toHaveAttribute('href', '/');
    });

    it('renders navigation links', () => {
        render(<Navbar />);
        // Checking desktop links (might be duplicated due to mobile menu, getAllByText handles this)
        const listLinks = screen.getAllByText('List');
        expect(listLinks.length).toBeGreaterThan(0);
        expect(listLinks[0].closest('a')).toHaveAttribute('href', '/totes');

        const scanLinks = screen.getAllByText('Scan');
        expect(scanLinks.length).toBeGreaterThan(0);
        expect(scanLinks[0].closest('a')).toHaveAttribute('href', '/scan');
    });

    it('renders AuthButton', () => {
        render(<Navbar />);
        expect(screen.getAllByText('Auth Button')[0]).toBeInTheDocument();
    });

    it('renders ThemePicker', () => {
        render(<Navbar />);
        expect(screen.getByTestId('theme-picker')).toBeInTheDocument();
    });
});
