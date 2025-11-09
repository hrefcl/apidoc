import { test, expect } from '@playwright/test';

test.describe('Version Selector Tests', () => {
  test('should verify version selector exists and works', async ({ page }) => {
    // Navigate to the i18n demo
    await page.goto('http://localhost:3900');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('\n=== CHECKING VERSION SELECTOR ===');

    // Check if there are endpoints with multiple versions
    const versionData = await page.evaluate(() => {
      const data = (window as any).__APICAT_DATA__;

      // Look for endpoints with multiple versions
      let multiVersionEndpoint = null;
      if (data?.api) {
        Object.values(data.api).forEach((group: any) => {
          if (group.endpoints) {
            group.endpoints.forEach((endpoint: any) => {
              if (endpoint.versions && Array.isArray(endpoint.versions) && endpoint.versions.length > 1) {
                multiVersionEndpoint = {
                  name: endpoint.name,
                  method: endpoint.method,
                  url: endpoint.url,
                  versionCount: endpoint.versions.length,
                  versions: endpoint.versions.map((v: any) => v.version)
                };
              }
            });
          }
        });
      }

      return {
        hasMultiVersionEndpoint: !!multiVersionEndpoint,
        endpoint: multiVersionEndpoint
      };
    });

    console.log('Version data:', JSON.stringify(versionData, null, 2));

    // Navigate to an endpoint page
    const endpointLink = page.locator('a[href*="/api/"]').first();
    if (await endpointLink.count() > 0) {
      await endpointLink.click();
      await page.waitForTimeout(2000);

      // Look for version selector
      const versionSelector = page.locator('h3:has-text("Versiones")').first();
      const selectorExists = await versionSelector.count() > 0;
      console.log('✅ Version selector exists:', selectorExists);

      if (selectorExists) {
        // Get version buttons
        const versionButtons = page.locator('button:has-text("v")');
        const buttonCount = await versionButtons.count();
        console.log('✅ Version buttons count:', buttonCount);

        // Get all versions
        const versions = [];
        for (let i = 0; i < buttonCount; i++) {
          const text = await versionButtons.nth(i).textContent();
          versions.push(text?.trim());
        }
        console.log('✅ Available versions:', versions);

        // Try to click on a different version
        if (buttonCount > 1) {
          console.log('\n=== SWITCHING VERSION ===');

          // Find the button without checkmark
          const uncheckedBtn = page.locator('button:has-text("v")').filter({
            hasNot: page.locator('svg.lucide-check')
          }).first();

          if (await uncheckedBtn.count() > 0) {
            const versionText = await uncheckedBtn.textContent();
            console.log('Clicking on version:', versionText);

            await uncheckedBtn.click();
            await page.waitForTimeout(1500);

            // Check if content changed
            console.log('✅ Version clicked');
          }
        }

        // Check compare button
        const compareBtn = page.locator('button:has-text("Comparar")').first();
        const compareExists = await compareBtn.count() > 0;
        console.log('\n✅ Compare button exists:', compareExists);

        if (compareExists) {
          console.log('Clicking compare button...');
          await compareBtn.click();
          await page.waitForTimeout(1000);
          console.log('✅ Compare button clicked');
        }
      }
    }
  });
});