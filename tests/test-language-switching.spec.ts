import { test, expect } from '@playwright/test';

test.describe('Language Switching in ApiContent', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the generated documentation
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
  });

  test('should change content when language is selected', async ({ page }) => {
    console.log('=== TEST: LANGUAGE SWITCHING ===\n');

    // 1. Navigate to CreateUser endpoint
    await page.click('text=CreateUser');
    await page.waitForTimeout(500);

    // 2. Get initial title (should be in Spanish by default for v2.0.0)
    const initialTitle = await page.locator('h2').first().textContent();
    console.log('📝 Initial title:', initialTitle);

    // 3. Open VersionSelector and select English
    const versionButton = page.locator('button', { hasText: 'v2.0.0' });
    await versionButton.click();
    await page.waitForTimeout(300);

    // 4. Click English language button
    const englishButton = page.locator('button', { hasText: 'English' });
    await englishButton.click();
    await page.waitForTimeout(500);

    // 5. Get new title (should now be in English)
    const newTitle = await page.locator('h2').first().textContent();
    console.log('📝 New title after selecting English:', newTitle);

    // 6. Verify the title changed
    expect(newTitle).not.toBe(initialTitle);
    expect(newTitle).toContain('Create User'); // English version

    console.log('✅ TEST PASSED: Content changed when language was selected');
  });

  test('should show correct languages for each version', async ({ page }) => {
    console.log('=== TEST: VERSION-SPECIFIC LANGUAGES ===\n');

    // 1. Navigate to CreateUser endpoint
    await page.click('text=CreateUser');
    await page.waitForTimeout(500);

    // 2. Check v2.0.0 languages (should have ES, EN, FR - 3 languages)
    const v2Button = page.locator('button', { hasText: 'v2.0.0' });
    await v2Button.click();
    await page.waitForTimeout(300);

    const v2Languages = await page.locator('.language-option').count();
    console.log('📊 v2.0.0 languages count:', v2Languages);
    expect(v2Languages).toBe(3); // ES, EN, FR

    // 3. Switch to v1.0.0 (should have 6 languages)
    await v2Button.click(); // Close current
    await page.waitForTimeout(200);

    const v1Button = page.locator('button', { hasText: 'v1.0.0' });
    await v1Button.click();
    await page.waitForTimeout(300);

    const v1Languages = await page.locator('.language-option').count();
    console.log('📊 v1.0.0 languages count:', v1Languages);
    expect(v1Languages).toBe(6); // ES, EN, ZH, FR, DE, JA

    console.log('✅ TEST PASSED: Correct languages shown for each version');
  });

  test('should update description when language changes', async ({ page }) => {
    console.log('=== TEST: DESCRIPTION TRANSLATION ===\n');

    // 1. Navigate to CreateUser endpoint
    await page.click('text=CreateUser');
    await page.waitForTimeout(500);

    // 2. Get initial description (Spanish)
    const initialDesc = await page.locator('.endpoint-description').first().textContent();
    console.log('📝 Initial description (ES):', initialDesc?.substring(0, 50) + '...');

    // 3. Switch to English
    await page.click('button:has-text("v2.0.0")');
    await page.waitForTimeout(200);
    await page.click('button:has-text("English")');
    await page.waitForTimeout(500);

    // 4. Get new description (English)
    const newDesc = await page.locator('.endpoint-description').first().textContent();
    console.log('📝 New description (EN):', newDesc?.substring(0, 50) + '...');

    // 5. Verify description changed
    expect(newDesc).not.toBe(initialDesc);

    console.log('✅ TEST PASSED: Description updated when language changed');
  });
});
