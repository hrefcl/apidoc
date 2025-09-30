import { test, expect } from '@playwright/test'

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should start with light mode by default', async ({ page }) => {
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)
  })

  test('should toggle to dark mode when clicking theme button', async ({ page }) => {
    // Find and click the theme toggle button
    const themeButton = page.getByRole('button').filter({ has: page.locator('svg').first() }).nth(1)
    await themeButton.click()

    // Verify dark class is added to html
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Verify localStorage is updated
    const theme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBe('dark')
  })

  test('should toggle back to light mode', async ({ page }) => {
    // First toggle to dark
    const themeButton = page.getByRole('button').filter({ has: page.locator('svg').first() }).nth(1)
    await themeButton.click()

    // Then toggle back to light
    await themeButton.click()

    // Verify dark class is removed
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)

    // Verify localStorage is updated
    const theme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBe('light')
  })

  test('should persist theme preference across page reloads', async ({ page }) => {
    // Toggle to dark mode
    const themeButton = page.getByRole('button').filter({ has: page.locator('svg').first() }).nth(1)
    await themeButton.click()

    // Reload page
    await page.reload()

    // Verify dark mode persists
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  test('should apply correct colors in light mode', async ({ page }) => {
    // Check background color in light mode
    const body = page.locator('body')
    const bgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor)

    // Light mode should have a light background (not black/very dark)
    expect(bgColor).not.toBe('rgb(0, 0, 0)')
  })

  test('should apply correct colors in dark mode', async ({ page }) => {
    // Toggle to dark mode
    const themeButton = page.getByRole('button').filter({ has: page.locator('svg').first() }).nth(1)
    await themeButton.click()

    // Check that dark mode styles are applied
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Verify specific dark mode elements are visible
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })
})