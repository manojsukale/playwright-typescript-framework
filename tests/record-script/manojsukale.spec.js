const { test, expect} = require('@playwright/test');
test('Manoj Sukale Contact Form', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: {
            height: 600,
            width: 800
        }
    });
    await context.tracing.start({ screenshots: true, snapshots: true });
    const page = await context.newPage();
    await page.goto('https://manojsukale.com/');
    await page.getByRole('button', { name: 'Contact Me ' }).click();
    await page.getByRole('textbox', { name: 'Manoj' }).click();
    await page.locator('input[name="name"]').fill('manoj');
    await page.getByRole('textbox', { name: 'Sukale' }).click();
    await page.locator('input[name="Lname"]').fill('sukalem');
    await page.getByRole('textbox', { name: 'Choose a Service....' }).click();
    await page.getByText('WordPress').click();
    await context.tracing.stop({ path: 'trace1.zip' });
    await page.getByRole('textbox', { name: 'abc@gmail.com' }).click();
    await page.locator('input[name="email"]').fill('tt@gmail.com');
    await page.getByRole('textbox', { name: 'Your message*' }).click();
    await page.locator('textarea[name="message"]').fill('dsdsssdssdsdsdsds');
    await page.getByRole('button', { name: 'Send Message' }).click();
    await context.close();
})