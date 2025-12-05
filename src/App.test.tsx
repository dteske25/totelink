import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Add specific assertions here based on your App's content
        // For now, we just check if it renders
        expect(document.body).toBeDefined();
    });
});
