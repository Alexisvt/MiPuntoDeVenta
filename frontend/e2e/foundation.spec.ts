import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('shows the foundation and has no detectable accessibility violations', async ({ page }) => {
  await page.route('**/api/v1/health', (route) =>
    route.fulfill({ json: { status: 'UP' } }),
  );
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'La operación diaria, sin el ruido.' })).toBeVisible();
  await expect(page.getByText('Sistema disponible')).toBeVisible();
  await expect(page.getByText('Recibos internos no fiscales')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
