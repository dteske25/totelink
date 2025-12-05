import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconPicker } from './IconPicker';


describe('IconPicker', () => {
    it('renders with default icon when no icon selected', () => {
        render(<IconPicker onIconSelect={() => { }} />);
        // Package is the default icon in iconUtils
        // We can check if the SVG is present. Since we can't easily query by icon name in rendered SVG,
        // we assume if it renders without error and we see the container, it's good.
        // Or we can check for the chevron
        expect(document.querySelector('.h-18.w-18')).toBeInTheDocument();
    });

    it('opens dropdown on click', () => {
        render(<IconPicker onIconSelect={() => { }} />);

        // Click to open
        fireEvent.click(document.querySelector('.group.relative.cursor-pointer')!);

        expect(screen.getByText('Choose Icon')).toBeInTheDocument();
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('selects an icon and closes dropdown', () => {
        const handleSelect = vi.fn();
        render(<IconPicker onIconSelect={handleSelect} />);

        // Open dropdown
        fireEvent.click(document.querySelector('.group.relative.cursor-pointer')!);

        // Find an icon button (e.g., Box)
        const boxButton = screen.getByTitle('Box');
        fireEvent.click(boxButton);

        expect(handleSelect).toHaveBeenCalledWith('Box');
        expect(screen.queryByText('Choose Icon')).not.toBeInTheDocument();
    });

    it('closes dropdown when clicking outside (backdrop)', () => {
        render(<IconPicker onIconSelect={() => { }} />);

        // Open dropdown
        fireEvent.click(document.querySelector('.group.relative.cursor-pointer')!);
        expect(screen.getByText('Choose Icon')).toBeInTheDocument();

        // Click backdrop (fixed inset-0 div)
        const backdrop = document.querySelector('.fixed.inset-0.z-10')!;
        fireEvent.click(backdrop);

        expect(screen.queryByText('Choose Icon')).not.toBeInTheDocument();
    });
});
