import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToteDetails } from './ToteDetails';

vi.mock('./InlineEdit', () => ({ InlineEdit: () => <div>InlineEdit</div> }));
vi.mock('./ToteQRCode', () => ({ ToteQRCode: () => <div>QR</div> }));
vi.mock('./IconPicker', () => ({ IconPicker: () => <div>IconPicker</div> }));
vi.mock('./ToteImageGallery', () => ({ ToteImageGallery: () => <div>Gallery</div> }));
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('ToteDetails', () => {
  it('shows error when tote is missing', () => {
    render(<ToteDetails tote={null} />);
    expect(screen.getByText('Tote not found.')).toBeInTheDocument();
  });

  it('renders tote data', () => {
    render(<ToteDetails tote={{ id: '1', tote_name: 'My Tote' }} />);
    expect(screen.getByText('IconPicker')).toBeInTheDocument();
    expect(screen.getAllByText('InlineEdit').length).toBeGreaterThan(0);
  });
});
