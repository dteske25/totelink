import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToteDetails } from './ToteDetails';
import * as dbQueries from '../database/queries';
import useAuth from '../hooks/useAuth';
import userEvent from '@testing-library/user-event';

// Mock dependencies
vi.mock('../database/queries', () => ({
    getToteImageUrl: vi.fn(),
    deleteToteImage: vi.fn(),
    uploadToteImage: vi.fn(),
}));

vi.mock('../hooks/useAuth', () => ({
    default: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
    Link: ({ to, children, className }: any) => <a href={to} className={className}>{children}</a>
}));

vi.mock('./ToteQRCode', () => ({
    ToteQRCode: () => <div>QRCode Mock</div>
}));

describe('ToteDetails', () => {
    const mockTote = {
        id: '123',
        name: 'Test Tote',
        description: 'Test Description',
        icon: 'Box',
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
    };

    const mockImages = [
        {
            id: 'img1',
            file_path: 'path/to/img1.jpg',
            tote_id: '123',
            user_id: 'user1',
            created_at: new Date().toISOString()
        },
    ];

    const mockUser = { id: 'user1' };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: mockUser });
        (dbQueries.getToteImageUrl as any).mockResolvedValue('http://example.com/img1.jpg');
    });

    it('renders tote not found message when tote is null', () => {
        render(<ToteDetails tote={null} />);
        expect(screen.getByText('Tote not found.')).toBeInTheDocument();
    });

    it('renders tote details correctly', async () => {
        render(<ToteDetails tote={mockTote} images={mockImages} />);

        // InlineEdit view mode renders text in a div, not an input
        expect(screen.getByText('Test Tote')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Images')).toBeInTheDocument();

        await waitFor(() => {
            const img = screen.getByAltText('Tote image');
            expect(img).toHaveAttribute('src', 'http://example.com/img1.jpg');
        });
    });

    it('calls onUpdateTote when title is saved', async () => {
        const handleUpdate = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        render(<ToteDetails tote={mockTote} onUpdateTote={handleUpdate} />);

        // Click text to enter edit mode
        const titleText = screen.getByText('Test Tote');
        await user.click(titleText);

        // Find input by value (now it's in edit mode) or role
        const input = screen.getByDisplayValue('Test Tote');
        await user.clear(input);
        await user.type(input, 'New Title{enter}');

        expect(handleUpdate).toHaveBeenCalledWith('123', { name: 'New Title' });
    });

    it('calls onUpdateTote when description is saved', async () => {
        const handleUpdate = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        render(<ToteDetails tote={mockTote} onUpdateTote={handleUpdate} />);

        const descText = screen.getByText('Test Description');
        await user.click(descText);

        const input = screen.getByRole('textbox'); // Textarea
        await user.clear(input);
        await user.type(input, 'New Description');
        fireEvent.blur(input);

        expect(handleUpdate).toHaveBeenCalledWith('123', { description: 'New Description' });
    });

    it('handles image upload', async () => {
        const onImagesChange = vi.fn();
        const user = userEvent.setup();
        render(<ToteDetails tote={mockTote} images={[]} onImagesChange={onImagesChange} />);

        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
        const input = screen.getByLabelText('Upload');

        await user.upload(input, file);

        expect(dbQueries.uploadToteImage).toHaveBeenCalledWith('123', file, 'user1');
        await waitFor(() => expect(onImagesChange).toHaveBeenCalled());
    });

    it('handles image deletion', async () => {
        const onImagesChange = vi.fn();
        // Mock confirm
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
        (dbQueries.deleteToteImage as any).mockResolvedValue(undefined);

        const { container } = render(<ToteDetails tote={mockTote} images={mockImages} onImagesChange={onImagesChange} />);

        await waitFor(() => expect(screen.getByAltText('Tote image')).toBeInTheDocument());

        const deleteBtn = container.querySelector('.btn-error');
        expect(deleteBtn).not.toBeNull();

        fireEvent.click(deleteBtn!);

        expect(confirmSpy).toHaveBeenCalled();
        expect(dbQueries.deleteToteImage).toHaveBeenCalledWith('img1');

        // Wait for async callback
        await waitFor(() => expect(onImagesChange).toHaveBeenCalled());

        confirmSpy.mockRestore();
    });
});
