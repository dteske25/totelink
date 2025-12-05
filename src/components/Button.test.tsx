import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button onClick={() => { }}>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onClick handler when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies default className if none provided', () => {
        render(<Button onClick={() => { }}>Default Class</Button>);
        const button = screen.getByText('Default Class');
        expect(button).toHaveClass('btn', 'btn-ghost');
    });

    it('applies custom className when provided', () => {
        render(<Button onClick={() => { }} className="custom-class">Custom Class</Button>);
        const button = screen.getByText('Custom Class');
        expect(button).toHaveClass('custom-class');
        expect(button).not.toHaveClass('btn-ghost'); // Should replace default if passed directly
    });
});
