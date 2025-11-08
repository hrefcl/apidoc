import { test, expect } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';

let serverProcess: ChildProcess;
const PORT = 3458;
const DOCS_PATH = '/tmp/i18n-test-versions';

test.describe('Version Selector and Comparison Debug', () => {
  test.beforeAll(async () => {
    console.log(`Starting server for ${DOCS_PATH} on port ${PORT}...`);
    serverProcess = spawn('npx', ['serve', DOCS_PATH, '-l', PORT.toString()], {
      stdio: 'pipe',
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  test.afterAll(async () => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  test('should check endpoint versions structure', async ({ page }) => {
    await page.goto(`http://localhost:${PORT}`);
    await page.waitForLoadState('networkidle');

    const versionInfo = await page.evaluate(() => {
      const data = (window as any).__APICAT_DATA__;

      // Get CreateUser endpoint (should have multiple versions)
      const createUserEndpoints = data.api?.users?.endpoints?.filter(
        (e: any) => e.name === 'CreateUser'
      ) || [];

      return {
        totalCreateUserEndpoints: createUserEndpoints.length,
        createUserVersions: createUserEndpoints.map((e: any) => ({
          version: e.version,
          title: e.title,
          hasMultipleLanguages: e.hasMultipleLanguages,
          hasVersionsArray: !!e.versions,
          versionsCount: e.versions ? e.versions.length : 0,
          hasMultipleVersions: e.hasMultipleVersions,
        })),
        firstEndpointFull: createUserEndpoints[0] ? {
          id: createUserEndpoints[0].id,
          version: createUserEndpoints[0].version,
          hasVersionsArray: !!createUserEndpoints[0].versions,
          versionsArrayLength: createUserEndpoints[0].versions?.length || 0,
          hasMultipleVersions: createUserEndpoints[0].hasMultipleVersions,
          versions: createUserEndpoints[0].versions,
        } : null,
      };
    });

    console.log('\n📊 Version Structure Analysis:');
    console.log(JSON.stringify(versionInfo, null, 2));
  });

  test('should search for version selector in UI', async ({ page }) => {
    await page.goto(`http://localhost:${PORT}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Navigate to an endpoint that should have versions
    const hasApiLink = await page.locator('text=/CreateUser/i').count();
    console.log(`\n🔍 CreateUser links found: ${hasApiLink}`);

    if (hasApiLink > 0) {
      // Click on first CreateUser link
      await page.locator('text=/CreateUser/i').first().click();
      await page.waitForTimeout(2000);

      // Take screenshot
      await page.screenshot({ path: '/tmp/version-debug-createuser-page.png', fullPage: true });

      // Search for version-related elements
      const versionElements = await page.evaluate(() => {
        const selectors = [
          'select[class*="version"]',
          '[data-testid="version-selector"]',
          'button[class*="version"]',
          '.version-badge',
          '.version-selector',
          '[class*="Version"]',
          'text=/v1.0.0/i',
          'text=/v2.0.0/i',
          'text=/version/i',
        ];

        const results: any = {};
        selectors.forEach((selector) => {
          try {
            const elements = document.querySelectorAll(selector);
            results[selector] = {
              count: elements.length,
              texts: Array.from(elements).slice(0, 3).map(el => ({
                tag: el.tagName,
                text: (el as HTMLElement).innerText?.substring(0, 50),
                visible: (el as HTMLElement).offsetParent !== null,
              })),
            };
          } catch (e) {
            results[selector] = { error: (e as Error).message };
          }
        });

        return results;
      });

      console.log('\n🔍 Version selector search results:');
      console.log(JSON.stringify(versionElements, null, 2));
    }
  });

  test('should check for version comparison component', async ({ page }) => {
    await page.goto(`http://localhost:${PORT}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Look for comparison-related elements
    const comparisonElements = await page.evaluate(() => {
      const selectors = [
        '[class*="comparison"]',
        '[class*="compare"]',
        '[data-testid*="compare"]',
        'button:has-text("Compare")',
        'text=/compare/i',
        '.version-compare',
      ];

      const results: any = {};
      selectors.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          results[selector] = elements.length;
        } catch (e) {
          results[selector] = 0;
        }
      });

      return results;
    });

    console.log('\n🔍 Version comparison search results:');
    console.log(JSON.stringify(comparisonElements, null, 2));
  });

  test('should inspect Vue component structure', async ({ page }) => {
    await page.goto(`http://localhost:${PORT}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check Vue app structure
    const vueStructure = await page.evaluate(() => {
      const app = document.querySelector('#app');
      if (!app) return null;

      const getAllComponents = (el: Element): string[] => {
        const components: string[] = [];
        const tag = el.tagName.toLowerCase();
        if (tag.includes('-') || el.className.includes('api') || el.className.includes('endpoint')) {
          components.push(tag);
        }
        Array.from(el.children).forEach(child => {
          components.push(...getAllComponents(child));
        });
        return components;
      };

      return {
        allComponents: Array.from(new Set(getAllComponents(app))),
        hasRouter: !!(window as any).__VUE_ROUTER__,
        currentRoute: (window as any).__VUE_ROUTER__?.currentRoute?.value,
      };
    });

    console.log('\n🏗️  Vue component structure:');
    console.log(JSON.stringify(vueStructure, null, 2));
  });
});
