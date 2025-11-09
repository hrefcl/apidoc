import { test, expect } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';

let serverProcess: ChildProcess;
const PORT = 3600;
const DOCS_PATH = '/tmp/i18n-test-FINAL';

test.describe('i18n Language Selector Check', () => {
  test('should detect all 3 languages in selector (ES, EN, ZH)', async ({ page }) => {
    // Capture browser console logs
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      if (text.includes('🔍')) {
        console.log(text);
      }
    });

    // Navigate to the generated documentation
    await page.goto(`http://localhost:${PORT}`);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Print all console logs with 🔍
    console.log('\n📋 Browser Console Logs:');
    consoleLogs.filter(log => log.includes('🔍')).forEach(log => console.log(log));

    // Get complete data structure
    const debugData = await page.evaluate(() => {
      const data = (window as any).__APICAT_DATA__;

      return {
        // Check users endpoints structure
        usersEndpoints: data.api?.users?.endpoints?.map((ep: any) => ({
          name: ep.name,
          version: ep.version,
          topLevelLanguages: ep.languages ? Object.keys(ep.languages) : [],
          hasVersionsArray: !!ep.versions,
          versionsArrayLength: ep.versions?.length || 0,
          versionsData: ep.versions?.map((v: any) => ({
            version: v.version,
            name: v.name,
            languages: v.languages ? Object.keys(v.languages) : []
          })) || []
        })) || [],

        // Check products endpoints
        productsEndpoints: data.api?.products?.endpoints?.map((ep: any) => ({
          name: ep.name,
          version: ep.version,
          topLevelLanguages: ep.languages ? Object.keys(ep.languages) : []
        })) || []
      };
    });

    console.log('\n📊 COMPLETE DATA STRUCTURE:');
    console.log(JSON.stringify(debugData, null, 2));

    // Check __APICAT_DATA__ for i18n config
    const i18nConfig = await page.evaluate(() => {
      return (window as any).__APICAT_DATA__?.meta?.i18n;
    });

    console.log('\n📊 i18n Configuration:');
    console.log(JSON.stringify(i18nConfig, null, 2));

    // Check what languages the Vue app detected
    const detectedLanguages = await page.evaluate(() => {
      // Access Vue app state
      const app = document.querySelector('#app');
      if (!app) return null;

      // Try to get the store state
      return {
        hasI18nStore: !!(window as any).__VUE_APP__?.config?.globalProperties?.$i18n,
        storeLanguages: (window as any).__PINIA_STATE__?.docs?.availableLanguages || null,
      };
    });

    console.log('\n🔍 Vue App Languages:');
    console.log(JSON.stringify(detectedLanguages, null, 2));

    // Look for language buttons in the UI
    const languageButtons = await page.evaluate(() => {
      // Find all buttons that might be language selectors
      const allButtons = Array.from(document.querySelectorAll('button'));
      const languageButtons = allButtons.filter(btn => {
        const text = btn.textContent || '';
        return /^(ES|EN|ZH|FR|DE|JA)$/i.test(text.trim());
      });

      return languageButtons.map(btn => ({
        text: btn.textContent?.trim(),
        visible: btn.offsetParent !== null,
        classes: btn.className,
        parentText: btn.parentElement?.textContent?.substring(0, 50),
      }));
    });

    console.log('\n🔘 Language Buttons Found:');
    console.log(JSON.stringify(languageButtons, null, 2));

    // Check for language selector container
    const languageContainer = await page.evaluate(() => {
      const containers = Array.from(document.querySelectorAll('[class*="lang"]'));
      return containers.slice(0, 3).map(el => ({
        tag: el.tagName,
        classes: (el as HTMLElement).className,
        text: (el as HTMLElement).innerText?.substring(0, 100),
        childCount: el.children.length,
      }));
    });

    console.log('\n📦 Language Container Elements:');
    console.log(JSON.stringify(languageContainer, null, 2));

    // Take screenshot
    await page.screenshot({
      path: '/tmp/i18n-language-check.png',
      fullPage: true
    });

    // Expectations
    expect(i18nConfig).toBeTruthy();
    expect(i18nConfig?.availableLangs).toEqual(['es', 'en', 'zh']);

    // Should have at least 3 language buttons (ES, EN, ZH)
    expect(languageButtons.length).toBeGreaterThanOrEqual(3);

    // Check that we have all 3 languages
    const foundLanguages = languageButtons.map(btn => btn.text);
    expect(foundLanguages).toContain('EN');
    expect(foundLanguages).toContain('ES');
    expect(foundLanguages).toContain('ZH');
  });
});
