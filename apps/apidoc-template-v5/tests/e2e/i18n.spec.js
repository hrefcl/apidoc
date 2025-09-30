import { test, expect } from '@playwright/test'

test.describe('Internationalization (i18n)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display language selector', async ({ page }) => {
    // Language selector should be visible in header
    const languageSelector = page.locator('[class*="relative"]').filter({ hasText: /español|english/i }).first()
    await expect(languageSelector).toBeVisible()
  })

  test('should change language when selecting from dropdown', async ({ page }) => {
    // Open language dropdown
    const languageButton = page.locator('button').filter({ has: page.locator('svg').first() }).first()
    await languageButton.click()

    // Select English
    const englishOption = page.getByRole('button', { name: /english/i })
    await englishOption.click()

    // Verify content changed to English
    const title = page.getByRole('heading', { level: 1 })
    await expect(title).toContainText(/APIDoc v5 Documentation/)
  })

  test('should persist language preference in localStorage', async ({ page }) => {
    // Open language dropdown
    const languageButton = page.locator('button').filter({ has: page.locator('svg').first() }).first()
    await languageButton.click()

    // Select English
    const englishOption = page.getByRole('button', { name: /english/i })
    await englishOption.click()

    // Check localStorage
    const locale = await page.evaluate(() => localStorage.getItem('apidoc-locale'))
    expect(locale).toBe('en')
  })

  test('should maintain language preference after page reload', async ({ page }) => {
    // Change to English
    const languageButton = page.locator('button').filter({ has: page.locator('svg').first() }).first()
    await languageButton.click()

    const englishOption = page.getByRole('button', { name: /english/i })
    await englishOption.click()

    // Reload page
    await page.reload()

    // Verify English is still active
    const title = page.getByRole('heading', { level: 1 })
    await expect(title).toContainText(/APIDoc v5 Documentation/)
  })

  test('should translate homepage content correctly', async ({ page }) => {
    // Initially in Spanish
    let subtitle = page.locator('p').filter({ hasText: /documentación/i }).first()
    await expect(subtitle).toContainText(/Documentación hermosa y moderna/)

    // Switch to English
    const languageButton = page.locator('button').filter({ has: page.locator('svg').first() }).first()
    await languageButton.click()

    const englishOption = page.getByRole('button', { name: /english/i })
    await englishOption.click()

    // Check English translation
    subtitle = page.locator('p').filter({ hasText: /documentation/i }).first()
    await expect(subtitle).toContainText(/Beautiful and modern documentation/)
  })

  test('should translate feature titles', async ({ page }) => {
    // Check Spanish features
    await expect(page.getByText(/rápido y moderno/i)).toBeVisible()

    // Switch to English
    const languageButton = page.locator('button').filter({ has: page.locator('svg').first() }).first()
    await languageButton.click()

    const englishOption = page.getByRole('button', { name: /english/i })
    await englishOption.click()

    // Check English features
    await expect(page.getByText(/fast and modern/i)).toBeVisible()
  })

  test('should translate stats labels', async ({ page }) => {
    // Check Spanish stats
    await expect(page.getByText(/documentos/i)).toBeVisible()
    await expect(page.getByText(/guías/i)).toBeVisible()

    // Switch to English
    const languageButton = page.locator('button').filter({ has: page.locator('svg').first() }).first()
    await languageButton.click()

    const englishOption = page.getByRole('button', { name: /english/i })
    await englishOption.click()

    // Check English stats
    await expect(page.getByText(/documents/i)).toBeVisible()
    await expect(page.getByText(/guides/i)).toBeVisible()
  })
})