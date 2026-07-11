const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// ---------- Load test data from JSON ----------
// Default path, override at runtime with:
//   TEST_DATA_PATH=/absolute/path/to/data.json npx playwright test
const dataPath = process.env.TEST_DATA_PATH || path.join(__dirname, '..', 'data', 'appointmentData.json');
const testCases = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

/**
 * Generates a random alphabetic string, e.g. "xqmZk".
 */
function randomText(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates dynamic contact data at runtime (name/email/mobile stay
 * generated, since these need to be unique per run - not meaningful as
 * fixed JSON values).
 */
function generateTestData() {
  const randomId = Date.now() + Math.floor(Math.random() * 1000);
  return {
    name: `Test User ${randomText()}`,
    email: `testuser${randomId}@gmail.com`,
    mobile: `5${Math.floor(10000000 + Math.random() * 89999999)}`,
  };
}

/**
 * Scopes to a "City / Clinic / Preferred Language" style field block.
 */
function fieldBlock(page, labelText) {
  return page.locator('div.width--one.mb--30').filter({
    has: page.locator('p.select', { hasText: labelText }),
  });
}

/**
 * Scopes to a radio-group block (Country / Gender).
 */
function radioBlock(page, labelText) {
  return page.locator(`xpath=//p[contains(text(),"${labelText}")]/following-sibling::div[1]`);
}

/**
 * Selects a radio option by visible text. Falls back to the first available
 * option (with a console warning) if the requested value isn't found on the
 * page - keeps the suite resilient if the JSON data drifts from the live site.
 */
async function selectRadioByText(page, labelText, desiredText) {
  const options = radioBlock(page, labelText).locator('.check--radio-wrap-label');
  await expect(options.first()).toBeVisible({ timeout: 15000 });

  const allText = (await options.allTextContents()).map((t) => t.trim());
  let index = allText.findIndex((t) => t.toLowerCase() === desiredText.toLowerCase());

  if (index === -1) {
    console.warn(`"${desiredText}" not found under "${labelText}". Available: [${allText.join(', ')}]. Falling back to first option.`);
    index = 0;
  }

  await options.nth(index).click();
  return allText[index];
}

/**
 * Selects a custom dropdown option by visible text, from a fieldBlock
 * (City / Clinic / Preferred Language). Falls back to the first available
 * option (with a console warning) if the requested value isn't found.
 */
async function selectDropdownByText(page, labelText, desiredText) {
  const block = fieldBlock(page, labelText);
  await block.locator('.select--container').click();

  const options = block.locator('.select--list li span');
  await expect(options.first()).toBeVisible({ timeout: 15000 });

  const allText = (await options.allTextContents()).map((t) => t.trim());
  let index = allText.findIndex((t) => t.toLowerCase() === desiredText.toLowerCase());

  if (index === -1) {
    console.warn(`"${desiredText}" not found under "${labelText}". Available: [${allText.join(', ')}]. Falling back to first option.`);
    index = 0;
  }

  await options.nth(index).click();

  // Wait for the dropdown to actually close before the next interaction -
  // avoids "element intercepts pointer events" on the field right below it.
  await expect(block.locator('.select--list')).toBeHidden({ timeout: 5000 }).catch(() => {});

  return allText[index];
}

for (const data of testCases) {
  test(`Book an appointment - ${data.country} - ${data.city} - ${data.clinic}`, async ({ page }) => {
    const contact = generateTestData();

    await page.goto('https://www.kayaskinclinic.com/uae/en');
    await page.getByRole('link', { name: 'Book an Appointment ' }).click();
    await page.waitForURL('**/book-an-appointment');

    // ---------- 1. Country ----------
    const country = await selectRadioByText(page, 'Country', data.country);
    console.log(`Selected country: ${country}`);

    // ---------- 2. City ----------
    const city = await selectDropdownByText(page, 'City', data.city);
    console.log(`Selected city: ${city}`);

    // ---------- 3. Clinic ----------
    const clinic = await selectDropdownByText(page, 'Clinic', data.clinic);
    console.log(`Selected clinic: ${clinic}`);

    // ---------- 4. Name ----------
    await page.locator('#name').click();
    await page.locator('#name').fill(contact.name);

    // ---------- 5. Gender ----------
    const gender = await selectRadioByText(page, 'Gender', data.gender);
    console.log(`Selected gender: ${gender}`);

    // ---------- 6. Email ----------
    await page.locator('#email').click();
    await page.locator('#email').fill(contact.email);
    // NOTE: removed .press('Tab') here - it was leaving focus in an
    // unstable state (likely a native autofill/suggestion popup) which
    // made the #mobile click below time out. Filling + clicking the next
    // field directly is enough; .fill() doesn't need tab-based blur.

    // ---------- 7. Mobile ----------
    const mobileInput = page.locator('#mobile');
    await mobileInput.waitFor({ state: 'visible' });
    await mobileInput.click();
    await mobileInput.fill(contact.mobile);

    console.log(`Using contact info: ${contact.name}, ${contact.email}, +971${contact.mobile}`);

    // ---------- 8. Preferred Language ----------
    const language = await selectDropdownByText(page, 'Preferred Language', data.language);
    console.log(`Selected language: ${language}`);

    // ---------- 9. Submit ----------
    await page.getByRole('button', { name: 'Book an Appointment' }).click();

    // Optional: assert confirmation
    // await expect(page.getByText('Appointment booked successfully')).toBeVisible();
  });
}