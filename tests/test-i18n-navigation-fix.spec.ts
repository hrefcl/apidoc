import { test, expect } from '@playwright/test';

test.describe('i18n Navigation - Final Fix Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should show only 2 unique endpoints in navigation (no duplicates)', async ({ page }) => {
    console.log('\n=== CHECKING FOR DUPLICATES ===');

    // Click on Users group to expand
    await page.click('text=Users');
    await page.waitForTimeout(500);

    // Get all navigation links
    const navLinks = await page.$$eval('.space-y-1.ml-4 a', links =>
      links.map(link => link.textContent?.trim())
    );

    console.log(`Total navigation items found: ${navLinks.length}`);
    console.log('Navigation items:', navLinks);

    // Should be exactly 2 items (not 10)
    expect(navLinks.length).toBe(2);

    // Check for specific endpoints
    const hasCreateUser = navLinks.some(text => text?.includes('Usuario') || text?.includes('User'));
    const hasGetUser = navLinks.some(text => text?.includes('Obtener') || text?.includes('Get'));

    console.log(`Has CreateUser: ${hasCreateUser}`);
    console.log(`Has GetUser: ${hasGetUser}`);

    expect(hasCreateUser).toBe(true);
    expect(hasGetUser).toBe(true);
  });

  test('should show Spanish text by default', async ({ page }) => {
    console.log('\n=== CHECKING DEFAULT LANGUAGE (Spanish) ===');

    await page.click('text=Users');
    await page.waitForTimeout(500);

    const navLinks = await page.$$eval('.space-y-1.ml-4 a', links =>
      links.map(link => link.textContent?.trim())
    );

    console.log('Navigation text:', navLinks);

    // Should show Spanish text
    const hasSpanish = navLinks.some(text =>
      text?.includes('Crear Usuario') || text?.includes('Obtener Usuario')
    );

    expect(hasSpanish).toBe(true);
  });

  test('should change to English when language is switched', async ({ page }) => {
    console.log('\n=== TESTING LANGUAGE SWITCH ===');

    await page.click('text=Users');
    await page.waitForTimeout(500);

    // Get initial text (Spanish)
    const initialText = await page.$$eval('.space-y-1.ml-4 a', links =>
      links.map(link => link.textContent?.trim())
    );
    console.log('Initial (Spanish):', initialText);

    // Find and click language selector
    const langButton = await page.$('button[aria-label*="idioma"], button[aria-label*="language"], button:has-text("Español")');

    if (!langButton) {
      console.log('⚠️ Language selector not found, checking alternative selectors...');
      // Try alternative selectors
      const altButton = await page.$('.language-selector, [data-test="language-selector"]');
      if (altButton) {
        await altButton.click();
      } else {
        console.log('❌ No language selector found at all');
        return;
      }
    } else {
      await langButton.click();
    }

    await page.waitForTimeout(500);

    // Click English option
    const enOption = await page.$('button:has-text("English"), [role="menuitem"]:has-text("English")');
    if (enOption) {
      console.log('✅ Found English option, clicking...');
      await enOption.click();
      await page.waitForTimeout(1500);

      // Get new text (English)
      const newText = await page.$$eval('.space-y-1.ml-4 a', links =>
        links.map(link => link.textContent?.trim())
      );
      console.log('After switch (English):', newText);

      // Check that text changed to English
      const hasEnglish = newText.some(text =>
        text?.includes('Create User') || text?.includes('Get User')
      );
      const stillHasSpanish = newText.some(text =>
        text?.includes('Crear Usuario') || text?.includes('Obtener Usuario')
      );

      console.log(`Has English: ${hasEnglish}`);
      console.log(`Still has Spanish: ${stillHasSpanish}`);

      expect(hasEnglish).toBe(true);
      expect(stillHasSpanish).toBe(false);

      // Still should be only 2 items
      expect(newText.length).toBe(2);
    } else {
      console.log('⚠️ English option not found in menu');
    }
  });

  test('should show correct version selector with 2 versions', async ({ page }) => {
    console.log('\n=== CHECKING VERSION SELECTOR ===');

    await page.click('text=Users');
    await page.waitForTimeout(500);

    // Click on first endpoint
    await page.click('.space-y-1.ml-4 a >> nth=0');
    await page.waitForTimeout(1000);

    // Look for version selector
    const versionHeaders = await page.$$eval('h3', headers =>
      headers.map(h => h.textContent?.trim()).filter(text =>
        text?.includes('Version') || text?.includes('Versión')
      )
    );

    console.log('Version headers found:', versionHeaders);

    if (versionHeaders.length > 0) {
      // Check for version buttons
      const versionButtons = await page.$$eval('button', buttons =>
        buttons
          .map(b => b.textContent?.trim())
          .filter(text => text?.match(/v?\d+\.\d+\.\d+/))
      );

      console.log('Version buttons:', versionButtons);

      // Should have 2 versions (1.0.0 and 2.0.0)
      expect(versionButtons.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('should NOT show JSON objects in UI', async ({ page }) => {
    console.log('\n=== CHECKING FOR JSON LEAKS ===');

    const pageContent = await page.content();

    // Check for JSON patterns that shouldn't be visible
    const hasJSONLeak =
      pageContent.includes('"version":') ||
      pageContent.includes('"languages":') ||
      pageContent.includes('{"version"');

    // Note: This will be false if JSON is in script tags (which is OK)
    // We're checking for visible JSON in the DOM
    const visibleText = await page.textContent('body');
    const hasVisibleJSON =
      visibleText?.includes('{"version"') ||
      visibleText?.includes('"languages"');

    console.log(`Has visible JSON: ${hasVisibleJSON}`);

    expect(hasVisibleJSON).toBe(false);
  });
});
