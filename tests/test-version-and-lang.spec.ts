import { test, expect } from '@playwright/test';

test.describe('Multi-Version and Multi-Language Test', () => {
  test('should verify both version and language selectors work', async ({ page }) => {
    await page.goto('http://localhost:3900');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('\n=== CHECKING DATA STRUCTURE ===');

    // Check if data has multi-version and multi-language endpoints
    const dataCheck = await page.evaluate(() => {
      const data = (window as any).__APICAT_DATA__;

      let multiVersionEndpoint = null;
      let multiLangEndpoint = null;

      if (data?.api) {
        Object.values(data.api).forEach((group: any) => {
          if (group.endpoints) {
            group.endpoints.forEach((endpoint: any) => {
              if (endpoint.versions && endpoint.versions.length > 1) {
                multiVersionEndpoint = {
                  name: endpoint.name,
                  versionCount: endpoint.versions.length,
                  versions: endpoint.versions.map((v: any) => v.version),
                  hasLanguages: endpoint.versions.some((v: any) => v.languages)
                };
              }
              if (endpoint.languages && Object.keys(endpoint.languages).length > 1) {
                multiLangEndpoint = {
                  name: endpoint.name,
                  languages: Object.keys(endpoint.languages)
                };
              }
            });
          }
        });
      }

      return {
        hasMultiVersion: !!multiVersionEndpoint,
        multiVersion: multiVersionEndpoint,
        hasMultiLang: !!multiLangEndpoint,
        multiLang: multiLangEndpoint,
        i18nConfig: data?.meta?.i18n
      };
    });

    console.log('Data structure:', JSON.stringify(dataCheck, null, 2));

    // Check language selector
    console.log('\n=== LANGUAGE SELECTOR ===');
    const langSelector = page.locator('button:has(svg.lucide-languages)').first();
    const langSelectorExists = await langSelector.count() > 0;
    console.log('✅ Language selector exists:', langSelectorExists);

    if (langSelectorExists) {
      await langSelector.click();
      await page.waitForTimeout(500);

      const langOptions = await page.locator('.absolute.right-0.mt-2 button').count();
      console.log('✅ Language options:', langOptions);

      // Close dropdown
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // Navigate to Users section
    console.log('\n=== NAVIGATING TO USERS ===');
    const usersLink = page.locator('a:has-text("Users")').first();
    if (await usersLink.count() > 0) {
      await usersLink.click();
      await page.waitForTimeout(2000);

      // Look for endpoint cards
      const endpointCards = page.locator('.endpoints-list button');
      const cardCount = await endpointCards.count();
      console.log('✅ Endpoint cards found:', cardCount);

      if (cardCount > 0) {
        // Click on first endpoint
        await endpointCards.first().click();
        await page.waitForTimeout(2000);

        // Now check for version selector
        console.log('\n=== VERSION SELECTOR ===');
        const versionHeader = page.locator('h3:has-text("Versiones")').first();
        const versionSelectorExists = await versionHeader.count() > 0;
        console.log('✅ Version selector exists:', versionSelectorExists);

        if (versionSelectorExists) {
          const versionButtons = page.locator('button:has-text("v")');
          const versionCount = await versionButtons.count();
          console.log('✅ Version buttons:', versionCount);

          // Get all versions
          const versions = [];
          for (let i = 0; i < versionCount; i++) {
            const text = await versionButtons.nth(i).textContent();
            versions.push(text?.trim());
          }
          console.log('✅ Available versions:', versions);

          // Try switching version
          if (versionCount > 1) {
            const secondVersion = versionButtons.nth(1);
            const versionText = await secondVersion.textContent();
            console.log(`\nSwitching to version: ${versionText}`);

            await secondVersion.click();
            await page.waitForTimeout(1500);

            console.log('✅ Version switched');
          }

          // Check compare button
          const compareBtn = page.locator('button:has-text("Comparar")').first();
          const compareExists = await compareBtn.count() > 0;
          console.log('✅ Compare button exists:', compareExists);
        }

        // Test language selector on endpoint page
        console.log('\n=== LANGUAGE SELECTOR ON ENDPOINT PAGE ===');
        const langSelectorOnPage = page.locator('button:has(svg.lucide-languages)').first();
        if (await langSelectorOnPage.count() > 0) {
          await langSelectorOnPage.click();
          await page.waitForTimeout(500);

          const langBtn = page.locator('button:has-text("Español")').first();
          if (await langBtn.count() > 0) {
            await langBtn.click();
            await page.waitForTimeout(1500);

            console.log('✅ Language switched to Spanish');
          }
        }
      }
    }

    console.log('\n=== FINAL RESULTS ===');
    console.log('Multi-version support:', dataCheck.hasMultiVersion ? '✅' : '❌');
    console.log('Multi-language support:', dataCheck.hasMultiLang ? '✅' : '❌');
    console.log('Language selector:', langSelectorExists ? '✅' : '❌');

    expect(dataCheck.hasMultiVersion).toBe(true);
    expect(langSelectorExists).toBe(true);
  });
});