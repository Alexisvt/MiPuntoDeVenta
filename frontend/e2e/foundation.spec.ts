import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('supports a keyboard-first available service journey', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/api/v1/health', async (route) => {
    await route.fulfill({ contentType: 'application/json', json: { status: 'UP' } });
  });
  await page.goto('/');

  await expect(page.getByRole('main', { name: 'Mi punto de venta' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Sistema disponible');

  await page.keyboard.press('Tab');
  const detailsButton = page.getByRole('button', { name: 'Ver detalles' });
  await expect(detailsButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('La conexión se verifica directamente con el sistema.')).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('announces failure and keeps recovery inline', async ({ page }) => {
  let attempts = 0;
  await page.route('**/api/v1/health', async (route) => {
    attempts += 1;
    await route.fulfill(
      attempts <= 2
        ? { contentType: 'application/json', json: { message: 'Unavailable' }, status: 503 }
        : { contentType: 'application/json', json: { status: 'UP' } },
    );
  });
  await page.goto('/');

  const systemRegion = page.getByRole('region', { name: 'Estado del sistema' });
  await expect(systemRegion.getByRole('alert')).toContainText(
    'No pudimos conectar con el sistema',
  );
  const retryButton = page.getByRole('button', { name: 'Reintentar' });
  await retryButton.focus();
  await expect(retryButton).toBeFocused();
  await retryButton.press('Enter');

  await expect(page.getByRole('status')).toContainText('Sistema disponible');
  expect(attempts).toBe(3);
});
