import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display homepage with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/APIDoc/)

    // Check for hero section
    const title = page.getByRole('heading', { level: 1 })
    await expect(title).toBeVisible()
  })

  test('should navigate to documentation page when clicking "Ver Documentación"', async ({ page }) => {
    const viewDocsButton = page.getByRole('link', { name: /ver documentación|view documentation/i })
    await viewDocsButton.click()

    // Should navigate to docs page
    await expect(page).toHaveURL(/\/docs/)
  })

  test('should navigate back to home from logo', async ({ page }) => {
    // Navigate to a docs page first
    const viewDocsButton = page.getByRole('link', { name: /ver documentación|view documentation/i })
    await viewDocsButton.click()

    // Click logo to go home
    const logo = page.getByRole('link').filter({ has: page.getByText('APIDoc') }).first()
    await logo.click()

    // Should be back on homepage
    await expect(page).toHaveURL('/')
  })

  test('should display quick links section', async ({ page }) => {
    const quickLinksHeading = page.getByRole('heading', { name: /enlaces rápidos|quick links/i })
    await expect(quickLinksHeading).toBeVisible()

    // Check that quick links are clickable
    const quickLinks = page.locator('.grid').filter({ hasText: /autenticación|authentication/i }).locator('a')
    const count = await quickLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display features section', async ({ page }) => {
    // Check for features cards
    const features = page.locator('[class*="grid"]').filter({ hasText: /rápido|fast/i })
    await expect(features).toBeVisible()
  })

  test('should display stats section', async ({ page }) => {
    // Check for stats cards
    const statsSection = page.locator('[class*="grid"]').filter({ hasText: /documentos|documents/i })
    await expect(statsSection).toBeVisible()
  })

  test('should have working sidebar navigation in docs layout', async ({ page }) => {
    // Navigate to docs page
    const viewDocsButton = page.getByRole('link', { name: /ver documentación|view documentation/i })
    await viewDocsButton.click()

    // Wait for sidebar to be visible
    const sidebar = page.locator('aside').first()
    await expect(sidebar).toBeVisible()

    // Check that sidebar has navigation items
    const navItems = sidebar.locator('a')
    const count = await navItems.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should highlight active navigation item', async ({ page }) => {
    // Navigate to a specific doc
    const viewDocsButton = page.getByRole('link', { name: /ver documentación|view documentation/i })
    await viewDocsButton.click()

    // Check that an active nav item exists
    const activeNav = page.locator('[class*="primary"]').first()
    await expect(activeNav).toBeVisible()
  })

  test('should have mobile menu toggle', async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Navigate to docs
    const viewDocsButton = page.getByRole('link', { name: /ver documentación|view documentation/i })
    await viewDocsButton.click()

    // Mobile menu button should be visible
    const mobileMenuButton = page.getByRole('button').filter({ has: page.locator('svg') }).last()
    await expect(mobileMenuButton).toBeVisible()
  })
})