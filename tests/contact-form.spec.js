const { test, expect } = require('@playwright/test');

test('fill and send contact form on manojsukale.com', async ({ page }) => {
  await page.goto('https://manojsukale.com/');

  await page.getByRole('button', { name: 'Contact Me' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await dialog.getByPlaceholder('Manoj').fill('John');
  await dialog.getByPlaceholder('Sukale').fill('Doe');
  await dialog.getByPlaceholder('abc@gmail.com').fill('john.doe@example.com');
  await dialog.getByPlaceholder('Your message*').fill('This is a test message.');

  // Target only the visible fake input, not the hidden native <select>
  await dialog.getByRole('textbox', { name: 'Choose a Service....' }).click();
  await page.getByText('WordPress', { exact: true }).click(); // adjust option text if needed

  await dialog.getByRole('button', { name: 'Send Message' }).click();
});