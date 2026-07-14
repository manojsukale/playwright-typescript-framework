const { test, expect } = require('@playwright/test');
test('Amazon Search test', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    await page.getByRole('searchbox', { name: 'Search Amazon.in' }).click();
    await page.getByRole('searchbox', { name: 'Search Amazon.in' }).fill('yoga mat');
    await page.getByRole('searchbox', { name: 'Search Amazon.in' }).press('Enter');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await page.close();

})


