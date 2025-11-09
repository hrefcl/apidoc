import { test, expect } from '@playwright/test';

test.describe('VersionSelector - Fixed Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3900');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Click on "Users" API to open an endpoint with versions
    await page.click('text=Users');
    await page.waitForTimeout(500);

    // Click on "Crear Usuario" to see the version selector
    await page.click('text=Crear Usuario');
    await page.waitForTimeout(1000);
  });

  test('should only show ONE VersionSelector in sidebar', async ({ page }) => {
    // Find all elements that look like version selectors
    const versionSelectors = page.locator('h3:has-text("Versiones"), h3:has-text("Versions")');
    const count = await versionSelectors.count();

    console.log(`\n=== VERSION SELECTORS COUNT ===`);
    console.log(`Found ${count} version selector(s)`);

    // Should only be ONE
    expect(count).toBe(1);
  });

  test('should NOT show JSON objects in version selector', async ({ page }) => {
    // Check if any visible text contains JSON-like patterns
    const pageContent = await page.content();

    console.log(`\n=== CHECKING FOR JSON IN VERSION SELECTOR ===`);

    // These patterns indicate JSON objects being displayed
    const jsonPatterns = [
      /\{[\s\n]*"version"[\s\n]*:/,
      /\{[\s\n]*version[\s\n]*:/,
      /"languages"[\s\n]*:/,
      /languages[\s\n]*:/
    ];

    let foundJSON = false;
    jsonPatterns.forEach(pattern => {
      if (pattern.test(pageContent)) {
        console.log(`❌ Found JSON pattern: ${pattern}`);
        foundJSON = true;
      }
    });

    if (!foundJSON) {
      console.log(`✅ No JSON objects found in page content`);
    }

    expect(foundJSON).toBe(false);
  });

  test('should show version strings correctly (v2.0.0, v1.0.0)', async ({ page }) => {
    // Find version buttons
    const v2Button = page.locator('button:has-text("v2.0.0")');
    const v1Button = page.locator('button:has-text("v1.0.0")');

    console.log(`\n=== VERSION STRINGS CHECK ===`);

    const v2Exists = await v2Button.count() > 0;
    const v1Exists = await v1Button.count() > 0;

    console.log(`✅ v2.0.0 button exists: ${v2Exists}`);
    console.log(`✅ v1.0.0 button exists: ${v1Exists}`);

    expect(v2Exists).toBe(true);
    expect(v1Exists).toBe(true);
  });

  test('should show nested languages under each version', async ({ page }) => {
    console.log(`\n=== NESTED LANGUAGES CHECK ===`);

    // Click on v2.0.0 to see if languages are nested underneath
    const v2Button = page.locator('button:has-text("v2.0.0")').first();
    await v2Button.click();
    await page.waitForTimeout(500);

    // Check for language buttons (ES, EN, ZH)
    const esButton = page.locator('button:has-text("Español")');
    const enButton = page.locator('button:has-text("English")');
    const zhButton = page.locator('button:has-text("中文")');

    const esCount = await esButton.count();
    const enCount = await enButton.count();
    const zhCount = await zhButton.count();

    console.log(`Language buttons found:`);
    console.log(`  - Español: ${esCount}`);
    console.log(`  - English: ${enCount}`);
    console.log(`  - 中文: ${zhCount}`);

    // At least one language should be visible
    const hasLanguages = esCount > 0 || enCount > 0 || zhCount > 0;
    expect(hasLanguages).toBe(true);
  });

  test('should change language when clicking language button', async ({ page }) => {
    console.log(`\n=== LANGUAGE SWITCHING TEST ===`);

    // Get initial title (should be in Spanish by default)
    const initialTitle = await page.locator('h1').first().textContent();
    console.log(`Initial title: ${initialTitle}`);

    // Click on English language button
    const enButton = page.locator('button:has-text("English")').first();
    if (await enButton.count() > 0) {
      await enButton.click();
      await page.waitForTimeout(1000);

      // Get new title
      const newTitle = await page.locator('h1').first().textContent();
      console.log(`After English click: ${newTitle}`);

      // Title should change (different language)
      expect(newTitle).not.toBe(initialTitle);
    } else {
      console.log(`⚠️ English button not found, skipping language switch test`);
    }
  });

  test('should NOT have VersionSelector in ApiContent (main content area)', async ({ page }) => {
    console.log(`\n=== VERSION SELECTOR PLACEMENT CHECK ===`);

    // VersionSelector should only be in sidebar (.w-64.flex-shrink-0)
    // NOT in main content area (.flex-1)

    const sidebarSelector = page.locator('.w-64.flex-shrink-0 h3:has-text("Versiones")');
    const contentSelector = page.locator('.flex-1 h3:has-text("Versiones")');

    const inSidebar = await sidebarSelector.count();
    const inContent = await contentSelector.count();

    console.log(`VersionSelector in sidebar: ${inSidebar}`);
    console.log(`VersionSelector in content: ${inContent}`);

    expect(inSidebar).toBeGreaterThan(0); // Should be in sidebar
    expect(inContent).toBe(0); // Should NOT be in content
  });

  test('should NOT show version dropdown in TableOfContents', async ({ page }) => {
    console.log(`\n=== TABLE OF CONTENTS CHECK ===`);

    // Find TableOfContents section (has "Contenido" or "Table of Contents" header)
    const tocHeader = page.locator('h3:has-text("Contenido"), h3:has-text("Table of Contents")');
    const tocExists = await tocHeader.count() > 0;

    console.log(`TableOfContents exists: ${tocExists}`);

    if (tocExists) {
      // Check if there's a version dropdown INSIDE the TOC
      const tocContainer = page.locator('.toc-sidebar');
      const versionDropdownInTOC = tocContainer.locator('select, .dropdown-toggle');
      const dropdownCount = await versionDropdownInTOC.count();

      console.log(`Version dropdowns in TOC: ${dropdownCount}`);

      // Should be ZERO - no version selector in TOC
      expect(dropdownCount).toBe(0);
    }
  });
});
