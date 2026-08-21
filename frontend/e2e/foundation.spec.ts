import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('shows the static scaffold and has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('main', { name: 'Mi punto de venta' })).toBeVisible();
  await expect(page.getByText('Nueva base web en preparación.')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
