import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InlineEdit } from './InlineEdit';
import userEvent from '@testing-library/user-event';

describe('InlineEdit', () => {
    it('renders value correctly in view mode', () => {
        render(<InlineEdit value="initial value" onSave={async () => { }} />);
        expect(screen.getByText('initial value')).toBeInTheDocument();
    });

    it('renders placeholder when value is empty', () => {
        render(<InlineEdit value="" placeholder="Enter text" onSave={async () => { }} />);
        expect(screen.getByText('Enter text')).toBeInTheDocument();
    });

    it('switches to edit mode on click', () => {
        render(<InlineEdit value="initial" onSave={async () => { }} />);
        fireEvent.click(screen.getByText('initial'));
        expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('calls onSave when entering text and pressing Enter (single line)', async () => {
        const handleSave = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        render(<InlineEdit value="initial" onSave={handleSave} />);

        await user.click(screen.getByText('initial'));
        const input = screen.getByRole('textbox');
        await user.clear(input);
        await user.type(input, 'new value{enter}');

        expect(handleSave).toHaveBeenCalledWith('new value');
    });

    it('calls onSave when blurring input', async () => {
        const handleSave = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        render(<InlineEdit value="initial" onSave={handleSave} />);

        await user.click(screen.getByText('initial'));
        const input = screen.getByRole('textbox');
        await user.clear(input);
        await user.type(input, 'new value');
        fireEvent.blur(input);

        expect(handleSave).toHaveBeenCalledWith('new value');
    });

    it('cancels edit on Escape', async () => {
        const handleSave = vi.fn();
        const user = userEvent.setup();
        render(<InlineEdit value="initial" onSave={handleSave} />);

        await user.click(screen.getByText('initial'));
        const input = screen.getByRole('textbox');
        await user.clear(input);
        await user.type(input, 'new value{Escape}');

        expect(handleSave).not.toHaveBeenCalled();
        expect(screen.getByText('initial')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
});
