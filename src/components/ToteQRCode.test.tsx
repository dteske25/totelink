import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToteQRCode } from './ToteQRCode';
import QRCode from 'qrcode';

// Mock QRCode library
vi.mock('qrcode', () => ({
    default: {
        toDataURL: vi.fn(),
    },
}));

describe('ToteQRCode', () => {
    it('renders initial state with button', () => {
        render(<ToteQRCode toteId="123" toteName="Test Tote" />);
        expect(screen.getByText('Get QR Code')).toBeInTheDocument();
        expect(screen.queryByAltText(/QR Code/)).not.toBeInTheDocument();
    });

    it('generates QR code when button is clicked', async () => {
        (QRCode.toDataURL as any).mockResolvedValue('data:image/png;base64,mocked');

        render(<ToteQRCode toteId="123" toteName="Test Tote" />);

        fireEvent.click(screen.getByText('Get QR Code'));

        expect(screen.getByText('Generating...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByAltText('QR Code for Test Tote')).toBeInTheDocument();
            expect(screen.getByAltText('QR Code for Test Tote')).toHaveAttribute('src', 'data:image/png;base64,mocked');
        });

        expect(QRCode.toDataURL).toHaveBeenCalled();
    });

    it('displays error if generation fails (console error)', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        (QRCode.toDataURL as any).mockRejectedValue(new Error('Generation failed'));

        render(<ToteQRCode toteId="123" toteName="Test Tote" />);
        fireEvent.click(screen.getByText('Get QR Code'));

        await waitFor(() => {
            expect(screen.getByText('Get QR Code')).toBeInTheDocument(); // Should revert/stay at button
            expect(screen.queryByText('Generating...')).not.toBeInTheDocument();
        });

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('allows closing the QR code view', async () => {
        (QRCode.toDataURL as any).mockResolvedValue('data:image/png;base64,mocked');
        render(<ToteQRCode toteId="123" toteName="Test Tote" />);

        fireEvent.click(screen.getByText('Get QR Code'));
        await waitFor(() => expect(screen.getByAltText(/QR Code/)).toBeInTheDocument());

        // Click close (X icon button)
        // Since we don't have text for X button, we can find by button role and check it's not "Download"
        const buttons = screen.getAllByRole('button');
        const closeButton = buttons[buttons.length - 1]; // Usually last button
        fireEvent.click(closeButton);

        expect(screen.getByText('Get QR Code')).toBeInTheDocument();
        expect(screen.queryByAltText(/QR Code/)).not.toBeInTheDocument();
    });

    it('triggers download when download button clicked', async () => {
        (QRCode.toDataURL as any).mockResolvedValue('data:image/png;base64,mocked');
        render(<ToteQRCode toteId="123" toteName="Test Tote" />);

        fireEvent.click(screen.getByText('Get QR Code'));
        await waitFor(() => expect(screen.getByAltText(/QR Code/)).toBeInTheDocument());

        // Mock anchor tag click
        const linkMock = {
            click: vi.fn(),
            download: '',
            href: '',
        };
        const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(linkMock as any);
        const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => ({}) as any);
        const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => ({}) as any);

        fireEvent.click(screen.getByText('Download'));

        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(linkMock.download).toBe('Test Tote-qr-code.png');
        expect(linkMock.href).toBe('data:image/png;base64,mocked');
        expect(linkMock.click).toHaveBeenCalled();
        expect(appendChildSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalled();

        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
    });
});
