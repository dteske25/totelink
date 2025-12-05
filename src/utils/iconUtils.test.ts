import { describe, it, expect } from 'vitest';
import { getIconComponent, AVAILABLE_ICONS } from './iconUtils';
import { Package } from 'lucide-react';

describe('iconUtils', () => {
    describe('getIconComponent', () => {
        it('returns the correct icon component for a valid icon name', () => {
            const iconName = 'Box';
            const Icon = getIconComponent(iconName);
            expect(Icon).toBeDefined();
            // We can check if it matches the one in AVAILABLE_ICONS
            const expectedIcon = AVAILABLE_ICONS.find(i => i.name === iconName)?.icon;
            expect(Icon).toBe(expectedIcon);
        });

        it('returns the default Package icon for an invalid icon name', () => {
            const Icon = getIconComponent('InvalidIconName');
            expect(Icon).toBe(Package);
        });

        it('returns the default Package icon for null', () => {
            const Icon = getIconComponent(null);
            expect(Icon).toBe(Package);
        });

        it('returns the default Package icon for empty string', () => {
            const Icon = getIconComponent('');
            expect(Icon).toBe(Package);
        });
    });
});
