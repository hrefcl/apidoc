import { test, expect } from '@playwright/test';

test.describe('Version Selector Debug', () => {
  test('should inspect version selector data structure', async ({ page }) => {
    // Capture all browser console logs
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`🖥️  [${type}] ${text}`);
    });

    await page.goto('http://localhost:3900');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('\n=== NAVIGATING TO ENDPOINT ===');

    // Click on Users
    const usersLink = page.locator('a:has-text("Users")').first();
    if (await usersLink.count() > 0) {
      await usersLink.click();
      await page.waitForTimeout(1500);

      // Click on first endpoint
      const endpointCards = page.locator('.endpoints-list button').first();
      if (await endpointCards.count() > 0) {
        await endpointCards.click();
        await page.waitForTimeout(2000);

        // Check for version selector
        const versionSelector = page.locator('h3:has-text("Versiones")').first();
        const selectorExists = await versionSelector.count() > 0;
        console.log('✅ Version selector exists:', selectorExists);

        if (selectorExists) {
          // Get all version buttons
          const versionButtons = page.locator('button:has-text("v")');
          const versionCount = await versionButtons.count();
          console.log('✅ Version buttons count:', versionCount);

          // Check for language buttons (should be nested under versions)
          const languageButtons = page.locator('button:has-text("Español"), button:has-text("English"), button:has-text("中文")');
          const langCount = await languageButtons.count();
          console.log('🌍 Language buttons count:', langCount);

          // Get the HTML of the version selector
          const selectorHTML = await versionSelector.locator('..').innerHTML();
          console.log('\n📄 Version Selector HTML (first 500 chars):');
          console.log(selectorHTML.substring(0, 500));
        }

        // Wait a bit to see all console logs
        await page.waitForTimeout(2000);
      }
    }
  });
});
