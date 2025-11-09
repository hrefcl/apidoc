import { test } from '@playwright/test';

test('Check DEBUG message', async ({ page }) => {
  await page.goto('http://localhost:3900');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Navigate to Users
  await page.locator('a:has-text("Users")').first().click();
  await page.waitForTimeout(1500);

  // Click first endpoint
  await page.locator('.endpoints-list button').first().click();
  await page.waitForTimeout(2000);

  // Look for DEBUG message
  const debugMsg = page.locator('text=/DEBUG:.*endpoint.versions/');
  if (await debugMsg.count() > 0) {
    const text = await debugMsg.textContent();
    console.log('📊 DEBUG MESSAGE FOUND:', text);
  } else {
    console.log('❌ No DEBUG message found');
  }

  // Take screenshot
  await page.screenshot({ path: '/tmp/endpoint-debug.png', fullPage: true });
  console.log('📸 Screenshot saved to /tmp/endpoint-debug.png');
});
