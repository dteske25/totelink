import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ThemePicker } from './ThemePicker';

describe('ThemePicker', () => {
    it('renders without crashing', () => {
        const { container } = render(<ThemePicker />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('toggles theme on click', () => {
        // Mock matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => { }, // Deprecated
                removeListener: () => { }, // Deprecated
                addEventListener: () => { },
                removeEventListener: () => { },
                dispatchEvent: () => { },
            }),
        });

        const { container } = render(<ThemePicker />);
        const button = container.firstChild as HTMLElement;

        // Initial state should be light (based on mock)
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');

        // Click to toggle
        fireEvent.click(button);
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

        // Click again to toggle back
        fireEvent.click(button);
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
});
