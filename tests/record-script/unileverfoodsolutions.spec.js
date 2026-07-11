const { test, expect } = require('@playwright/test');

test('unileverfoodsolutions contact form', async ({ page }) => {
    await page.goto('https://www.unileverfoodsolutions.co.in/contact-us');

    await page.locator('#first_name').fill('Test');
    await page.locator('#last_name').fill('Testi');
    await page.locator('#contactusForm #city').fill('Mumbai');
    await page.locator('#contactusForm #email').fill('test@gmail.com');
    await page.locator('#mobile').fill('9888383838');
    await page.locator('#inquiry_type').fill('demo');

    // Open "Type of business" dropdown and select once
    await page.getByText('Type of business').click();
    await page.locator('#contactusForm').getByText('Restaurant', { exact: true }).click();

    await page.locator('#comment').fill('tst');
    await page.getByRole('checkbox', { name: 'I consent to receiving' }).check();

    await expect(page.getByRole('button', { name: 'SUBMIT' })).toBeEnabled();
    await page.getByRole('button', { name: 'SUBMIT' }).click();

    await page.close();
});