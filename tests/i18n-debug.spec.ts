import { test, expect } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

let serverProcess: ChildProcess;
const PORT = 3457; // Changed port to avoid cache
const DOCS_PATH = '/tmp/i18n-playwright';

test.describe('i18n Language and Version Selectors', () => {
  test.beforeAll(async () => {
    // Start HTTP server for the generated docs
    console.log(`Starting server for ${DOCS_PATH} on port ${PORT}...`);
    serverProcess = spawn('npx', ['serve', DOCS_PATH, '-l', PORT.toString()], {
      stdio: 'pipe',
    });

    // Wait for server to be ready
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  test.afterAll(async () => {
    // Kill the server process
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  test('should load the documentation page', async ({ page }) => {
    // Navigate to the generated documentation
    await page.goto(`http://localhost:${PORT}`);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Take screenshot of initial state
    await page.screenshot({ path: '/tmp/i18n-debug-initial.png', fullPage: true });

    // Check for console errors
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleMessages.push(`[ERROR] ${msg.text()}`);
      }
    });

    // Log any errors
    if (consoleMessages.length > 0) {
      console.log('Console errors found:');
      consoleMessages.forEach((msg) => console.log(msg));
    }

    // Check if Vue app loaded
    const appExists = await page.locator('#app').count();
    console.log(`Vue app #app exists: ${appExists > 0}`);
    expect(appExists).toBeGreaterThan(0);
  });

  test('should find language selector', async ({ page }) => {
    await page.goto(`http://localhost:${PORT}`);
    await page.waitForLoadState('networkidle');

    // Wait a bit for Vue to render
    await page.waitForTimeout(2000);

    // Look for language selector with various selectors
    const selectors = [
      '.language-selector',
      '[data-testid="language-selector"]',
      'button:has-text("Languages")',
      'button:has-text("ES")',
      'button:has-text("EN")',
      'select[name="language"]',
      '[class*="lang"]',
      '[id*="lang"]',
    ];

    console.log('\n🔍 Searching for language selector...');
    for (const selector of selectors) {
      const count = await page.locator(selector).count();
      console.log(`  ${selector}: ${count} found`);
      if (count > 0) {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible();
        const text = await element.textContent();
        console.log(`    - Visible: ${isVisible}, Text: "${text}"`);
      }
    }

    // Take screenshot
    await page.screenshot({ path: '/tmp/i18n-debug-selector-search.png', fullPage: true });
  });

  test('should find version selector', async ({ page }) => {
    await page.goto(`http://localhost:${PORT}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Look for version selector
    const selectors = [
      '.version-selector',
      '[data-testid="version-selector"]',
      'select[name="version"]',
      'button:has-text("v1.0.0")',
      'button:has-text("v2.0.0")',
      '[class*="version"]',
      '[id*="version"]',
    ];

    console.log('\n🔍 Searching for version selector...');
    for (const selector of selectors) {
      const count = await page.locator(selector).count();
      console.log(`  ${selector}: ${count} found`);
      if (count > 0) {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible();
        const text = await element.textContent();
        console.log(`    - Visible: ${isVisible}, Text: "${text}"`);
      }
    }

    // Take screenshot
    await page.screenshot({ path: '/tmp/i18n-debug-version-search.png', fullPage: true });
  });

  test('should check embedded data', async ({ page }) => {
    // Disable cache to ensure fresh data
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' });
    await page.reload({ waitUntil: 'networkidle' });

    // Check if __APICAT_DATA__ is embedded
    const dataExists = await page.evaluate(() => {
      return typeof (window as any).__APICAT_DATA__ !== 'undefined';
    });

    console.log(`\n📊 __APICAT_DATA__ exists: ${dataExists}`);

    if (dataExists) {
      // Get detailed structure of __APICAT_DATA__
      const dataStructure = await page.evaluate(() => {
        const data = (window as any).__APICAT_DATA__;
        return {
          topLevelKeys: Object.keys(data),
          hasMeta: !!data.meta,
          hasApi: !!data.api,
          hasNavigation: !!data.navigation,
          metaKeys: data.meta ? Object.keys(data.meta) : null,
          metaI18n: data.meta?.i18n || null,
          apiKeys: data.api ? Object.keys(data.api) : null,
          apiUsersEndpoints: data.api?.users?.endpoints?.length || 0,
          hasMultipleLangs: data.api?.users?.endpoints
            ? data.api.users.endpoints.filter((e: any) => e.hasMultipleLanguages).length
            : 0,
        };
      });

      console.log('Data structure:', JSON.stringify(dataStructure, null, 2));
    }
  });

  test('should inspect page structure', async ({ page }) => {
    await page.goto(`http://localhost:${PORT}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Get all major elements
    const structure = await page.evaluate(() => {
      const app = document.querySelector('#app');
      if (!app) return { error: 'No #app found' };

      const getStructure = (el: Element, depth = 0): any => {
        if (depth > 3) return '...';
        return {
          tag: el.tagName,
          id: el.id || undefined,
          classes: el.className ? el.className.split(' ').slice(0, 3) : undefined,
          children: Array.from(el.children)
            .slice(0, 5)
            .map((child) => getStructure(child, depth + 1)),
        };
      };

      return getStructure(app);
    });

    console.log('\n🏗️  Page structure:');
    console.log(JSON.stringify(structure, null, 2));
  });

  test('should check for API endpoints rendered', async ({ page }) => {
    await page.goto(`http://localhost:${PORT}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Look for rendered endpoints
    const endpoints = await page.locator('[class*="endpoint"]').count();
    const articles = await page.locator('article').count();
    const sections = await page.locator('section').count();

    console.log(`\n📝 Rendered content:`);
    console.log(`  Endpoints: ${endpoints}`);
    console.log(`  Articles: ${articles}`);
    console.log(`  Sections: ${sections}`);

    // Look for specific endpoint names
    const createUserExists = await page.locator('text=/CreateUser/i').count();
    const getUserExists = await page.locator('text=/GetUser/i').count();
    const getProductExists = await page.locator('text=/GetProduct/i').count();

    console.log(`  CreateUser found: ${createUserExists}`);
    console.log(`  GetUser found: ${getUserExists}`);
    console.log(`  GetProduct found: ${getProductExists}`);

    // Take final screenshot
    await page.screenshot({ path: '/tmp/i18n-debug-content.png', fullPage: true });
  });
});
