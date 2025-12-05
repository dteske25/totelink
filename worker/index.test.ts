import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './index';

describe('Worker API', () => {
    let mockEnv: any;

    beforeEach(() => {
        mockEnv = {
            DB: {
                prepare: vi.fn(),
            },
            IMAGES: {
                delete: vi.fn(),
                get: vi.fn(),
                put: vi.fn(),
            },
        };
    });

    it('GET /api/totes returns list of totes', async () => {
        const mockTotes = [{ id: '1', name: 'Test Tote' }];

        mockEnv.DB.prepare.mockReturnValue({
            all: vi.fn().mockResolvedValue({ results: mockTotes }),
        });

        const res = await app.request('/api/totes', {}, mockEnv);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(mockTotes);
    });

    it('GET /api/totes/:id returns single tote', async () => {
        const mockTote = { id: '1', name: 'Test Tote' };

        const bindSpy = vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [mockTote] }) });
        mockEnv.DB.prepare.mockReturnValue({ bind: bindSpy });

        const res = await app.request('/api/totes/1', {}, mockEnv);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(mockTote);
        expect(mockEnv.DB.prepare).toHaveBeenCalledWith("SELECT * FROM totes WHERE id = ?");
        expect(bindSpy).toHaveBeenCalledWith('1');
    });

    it('PATCH /api/totes/:id updates tote', async () => {
        const updateData = { name: 'Updated Name' };
        const updatedTote = { id: '1', name: 'Updated Name', updated_on: '2023-01-01' };

        const bindUpdateSpy = vi.fn().mockReturnValue({ run: vi.fn().mockResolvedValue({}) });
        const bindSelectSpy = vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [updatedTote] }) });

        mockEnv.DB.prepare.mockImplementation(((query: string) => {
            if (query.startsWith('UPDATE')) return { bind: bindUpdateSpy };
            if (query.startsWith('SELECT')) return { bind: bindSelectSpy };
            return {};
        }) as any);

        const res = await app.request('/api/totes/1', {
            method: 'PATCH',
            body: JSON.stringify(updateData),
        }, mockEnv);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(updatedTote);
        expect(bindUpdateSpy).toHaveBeenCalled();
    });

    it('GET /api/totes/:id/images returns images', async () => {
        const mockImages = [{ id: 'img1', file_path: 'path.jpg' }];

        const bindSpy = vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: mockImages }) });
        mockEnv.DB.prepare.mockReturnValue({ bind: bindSpy });

        const res = await app.request('/api/totes/1/images', {}, mockEnv);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(mockImages);
        expect(mockEnv.DB.prepare).toHaveBeenCalledWith("SELECT * FROM tote_images WHERE tote_id = ? ORDER BY created_at DESC");
        expect(bindSpy).toHaveBeenCalledWith('1');
    });

    it('POST /api/totes/:id/images uploads image', async () => {
        const toteId = '1';
        const userId = 'user1';
        const file = new File(['content'], 'test.png', { type: 'image/png' });
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', userId);

        const bindInsertSpy = vi.fn().mockReturnValue({ run: vi.fn().mockResolvedValue({}) });

        mockEnv.DB.prepare.mockImplementation(((query: string) => {
            if (query.startsWith('INSERT')) return { bind: bindInsertSpy };
            return {};
        }) as any);

        const res = await app.request(`/api/totes/${toteId}/images`, {
            method: 'POST',
            body: formData,
        }, mockEnv);

        expect(res.status).toBe(200);
        const body = await res.json() as any;
        expect(body.tote_id).toBe(toteId);
        expect(mockEnv.IMAGES.put).toHaveBeenCalled();
        expect(bindInsertSpy).toHaveBeenCalled();
    });

    it('POST /api/totes creates a new tote', async () => {
        const newTote = { user_id: 'user1', name: 'New Tote' };
        const createdTote = { id: '123', ...newTote };

        const bindInsertSpy = vi.fn().mockReturnValue({ run: vi.fn().mockResolvedValue({}) });
        const bindSelectSpy = vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [createdTote] }) });

        mockEnv.DB.prepare.mockImplementation(((query: string) => {
            if (query.startsWith('INSERT')) return { bind: bindInsertSpy };
            if (query.startsWith('SELECT')) return { bind: bindSelectSpy };
            return {};
        }) as any);

        const res = await app.request('/api/totes', {
            method: 'POST',
            body: JSON.stringify(newTote),
        }, mockEnv);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(createdTote);
        expect(bindInsertSpy).toHaveBeenCalled();
    });

    it('DELETE /api/images/:id deletes image and record', async () => {
        const imageId = 'img1';
        const filePath = 'path/to/image.jpg';

        const bindSelectSpy = vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [{ file_path: filePath }] }) });
        const bindDeleteSpy = vi.fn().mockReturnValue({ run: vi.fn().mockResolvedValue({}) });

        mockEnv.DB.prepare.mockImplementation(((query: string) => {
            if (query.startsWith('SELECT')) return { bind: bindSelectSpy };
            if (query.startsWith('DELETE')) return { bind: bindDeleteSpy };
            return {};
        }) as any);

        const res = await app.request(`/api/images/${imageId}`, {
            method: 'DELETE',
        }, mockEnv);

        expect(res.status).toBe(204);
        expect(mockEnv.IMAGES.delete).toHaveBeenCalledWith(filePath);
    });
});
