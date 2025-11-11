import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';
import path from 'path';

// Test for single version with multiple languages - VersionSelector should appear
test.describe('Single Version with Multiple Languages', () => {
    const PORT = 49903;
    const BASE_URL = `http://localhost:${PORT}`;

    test('should show VersionSelector with single version but multiple languages', async ({ page }) => {
        // Go to the endpoint page (User API -> Get User - single version, 4 languages)
        await page.goto(`${BASE_URL}/#/api/users-get-getuser`);
        await page.waitForLoadState('networkidle');

        // Wait for content to render
        await page.waitForSelector('.api-content', { timeout: 5000 });

        console.log('🔍 Checking for VersionSelector...');

        // Check if VersionSelector component exists
        const versionSelector = page.locator('.version-group').first();
        const isVisible = await versionSelector.isVisible();

        console.log(`✅ VersionSelector visible: ${isVisible}`);

        // Should be visible because there are multiple languages
        expect(isVisible).toBe(true);

        // Check that there's only one version shown
        const versionButtons = page.locator('.version-group > button');
        const versionCount = await versionButtons.count();

        console.log(`📊 Version count: ${versionCount}`);
        expect(versionCount).toBe(1);

        // Check that there are multiple language buttons
        const languageButtons = page.locator('.version-group .border-l-2 button');
        const languageCount = await languageButtons.count();

        console.log(`🌍 Language count: ${languageCount}`);

        // Should have at least 2 languages (en, es, zh, fr, de, ja - total 6 in example)
        expect(languageCount).toBeGreaterThanOrEqual(2);

        // Verify language flags are present
        const flagEmojis = await languageButtons.locator('.text-base').allTextContents();
        console.log(`🚩 Language flags: ${flagEmojis.join(', ')}`);

        // Should have flag emojis
        expect(flagEmojis.length).toBeGreaterThanOrEqual(2);
        expect(flagEmojis.some(flag => flag.trim().length > 0)).toBe(true);

        console.log('✅ Test passed: VersionSelector appears with single version + multiple languages');
    });

    test('should allow switching between languages', async ({ page }) => {
        await page.goto(`${BASE_URL}/#/api/users-get-getuser`);
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.api-content', { timeout: 5000 });

        // Get the first language button (should be default selected)
        const languageButtons = page.locator('.version-group .border-l-2 button');
        const firstLang = languageButtons.first();
        const secondLang = languageButtons.nth(1);

        // Get the first language code
        const firstLangCode = await firstLang.locator('.font-mono').textContent();
        console.log(`🌍 First language: ${firstLangCode}`);

        // Click the second language
        await secondLang.click();
        await page.waitForTimeout(500); // Wait for state update

        // Verify the second language is now selected (has check icon)
        const secondLangHasCheck = await secondLang.locator('.lucide-check').isVisible();
        console.log(`✅ Second language selected: ${secondLangHasCheck}`);

        expect(secondLangHasCheck).toBe(true);

        console.log('✅ Test passed: Language switching works correctly');
    });

    test('should display correct language flags and names', async ({ page }) => {
        await page.goto(`${BASE_URL}/#/api/users-get-getuser`);
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.api-content', { timeout: 5000 });

        const languageButtons = page.locator('.version-group .border-l-2 button');
        const count = await languageButtons.count();

        console.log(`🌍 Checking ${count} language buttons...`);

        for (let i = 0; i < count; i++) {
            const button = languageButtons.nth(i);
            const flag = await button.locator('.text-base').textContent();
            const name = await button.locator('.flex-1').textContent();
            const code = await button.locator('.font-mono').textContent();

            console.log(`  ${i + 1}. ${flag} ${name} (${code})`);

            // Verify structure
            expect(flag).toBeTruthy();
            expect(name).toBeTruthy();
            expect(code).toBeTruthy();
            expect(code?.length).toBe(2); // ISO 639-1 code is 2 letters
        }

        console.log('✅ Test passed: All language buttons have correct structure');
    });

    test('should show VersionSelector for NO VERSION endpoint with multiple languages', async ({ page }) => {
        // Go to DeleteUser endpoint - NO VERSION, only multiple languages
        await page.goto(`${BASE_URL}/#/api/users-delete-deleteuser`);
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.api-content', { timeout: 5000 });

        console.log('🔍 Checking VersionSelector for no-version multi-lang endpoint...');

        // Check if VersionSelector component exists
        const versionSelector = page.locator('.version-group').first();
        const isVisible = await versionSelector.isVisible();

        console.log(`✅ VersionSelector visible (no version, multi-lang): ${isVisible}`);

        // Should be visible because there are multiple languages (even without versions)
        expect(isVisible).toBe(true);

        // Check that there are NO version buttons (since no @apiVersion)
        const versionButtons = page.locator('.version-group > button:has-text("v")');
        const versionCount = await versionButtons.count();

        console.log(`📊 Version count: ${versionCount}`);
        expect(versionCount).toBe(0); // No versions

        // Check that there are multiple language buttons
        const languageButtons = page.locator('.version-group .border-l-2 button');
        const languageCount = await languageButtons.count();

        console.log(`🌍 Language count: ${languageCount}`);

        // Should have 5 languages (es, en, zh, fr, de)
        expect(languageCount).toBeGreaterThanOrEqual(5);

        // Verify language flags are present
        const flagEmojis = await languageButtons.locator('.text-base').allTextContents();
        console.log(`🚩 Language flags: ${flagEmojis.join(', ')}`);

        expect(flagEmojis.length).toBeGreaterThanOrEqual(5);
        expect(flagEmojis.some(flag => flag.trim().length > 0)).toBe(true);

        console.log('✅ Test passed: VersionSelector appears for no-version multi-language endpoint');
    });
});
