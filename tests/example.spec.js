const { test, expect } = require('@playwright/test');
test('my first test', async ({ page }) => {
    await page.goto('https://www.google.com/');
    await expect(page).toHaveTitle('Google');
})


