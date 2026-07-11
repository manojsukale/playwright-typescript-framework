import { test, expect } from '@playwright/test';

/**
 * Generates dynamic contact data at runtime.
 */
function generateTestData() {
  const randomId = Date.now();
  return {
    name: `Test User ${randomId}`,
    email: `testuser${randomId}@gmail.com`,
    mobile: `5${Math.floor(10000000 + Math.random() * 89999999)}`, // 9 digits, UAE-style starting with 5
  };
}

/**
 * Scopes to a "City / Clinic / Preferred Language" style field block:
 * <div class="width--one mb--30">
 *   <p class="select">Label</p>
 *   <div class="select--container">...</div>
 * </div>
 */
function fieldBlock(page, labelText) {
  return page.locator('div.width--one.mb--30').filter({
    has: page.locator('p.select', { hasText: labelText }),
  });
}

/**
 * Scopes to a radio-group block (Country / Gender):
 * <p>Label</p>
 * <div class="flex ...">radios</div>
 */
function radioBlock(page, labelText) {
  return page.locator(`xpath=//p[contains(text(),"${labelText}")]/following-sibling::div[1]`);
}

test('Book an appointment - fully dynamic flow', async ({ page }) => {
  const testData = generateTestData();

  await page.goto('https://www.kayaskinclinic.com/uae/en');
  await page.getByRole('link', { name: 'Book an Appointment ' }).click();

  // Wait for actual navigation to the booking page.
  await page.waitForURL('**/book-an-appointment');

  // ---------- 1. Country (radio buttons, dynamic count) ----------
  const countryOptions = radioBlock(page, 'Country').locator('.check--radio-wrap-label');

  // Wait on the actual radio labels, not just the "Country" text - the label
  // renders immediately but the radio options can hydrate slightly later
  // depending on the browser engine.
  await expect(countryOptions.first()).toBeVisible({ timeout: 15000 });

  const countryCount = await countryOptions.count();
  expect(countryCount).toBeGreaterThan(0);

  const countryIndex = 0; // or Math.floor(Math.random() * countryCount)
  const countryName = (await countryOptions.nth(countryIndex).textContent())?.trim();
  await countryOptions.nth(countryIndex).click();
  console.log(`Selected country: ${countryName}`);

  // ---------- 2. City (pre-selected by default, click to open & reselect) ----------
  const cityBlock = fieldBlock(page, 'City');
  await cityBlock.locator('.select--container').click();

  const cityOptions = cityBlock.locator('.select--list li span');
  await expect(cityOptions.first()).toBeVisible({ timeout: 15000 });
  const cityCount = await cityOptions.count();
  expect(cityCount).toBeGreaterThan(0);

  const cityIndex = 0; // or randomize
  const cityName = (await cityOptions.nth(cityIndex).textContent())?.trim();
  await cityOptions.nth(cityIndex).click();

  // Wait for the dropdown list to actually close before touching anything
  // below it - otherwise the still-open <ul> can intercept pointer events
  // on the next field (browser-dependent close timing).
  await expect(cityBlock.locator('.select--list')).toBeHidden({ timeout: 5000 }).catch(() => {});
  console.log(`Selected city: ${cityName}`);

  // ---------- 3. Clinic (options depend on city chosen above) ----------
  const clinicBlock = fieldBlock(page, 'Clinic');
  await clinicBlock.locator('.select--container').click();

  const clinicOptions = clinicBlock.locator('.select--list li span');
  await expect(clinicOptions.first()).toBeVisible({ timeout: 15000 });
  const clinicCount = await clinicOptions.count();
  expect(clinicCount).toBeGreaterThan(0);

  const clinicIndex = 0; // or randomize
  const clinicName = (await clinicOptions.nth(clinicIndex).textContent())?.trim();
  await clinicOptions.nth(clinicIndex).click();

  // Same close-wait as City - this is exactly what caused the Firefox
  // failure: the Clinic list stayed open and intercepted the click on #name.
  await expect(clinicBlock.locator('.select--list')).toBeHidden({ timeout: 5000 }).catch(() => {});
  console.log(`Selected clinic: ${clinicName}`);

  // ---------- 4. Name ----------
  await page.locator('#name').click();
  await page.locator('#name').fill(testData.name);

  // ---------- 5. Gender (radio buttons, dynamic count) ----------
  const genderOptions = radioBlock(page, 'Gender').locator('.check--radio-wrap-label');
  await expect(genderOptions.first()).toBeVisible({ timeout: 15000 });
  const genderCount = await genderOptions.count();
  expect(genderCount).toBeGreaterThan(0);

  const genderIndex = 0; // or randomize between Male/Female
  const genderName = (await genderOptions.nth(genderIndex).textContent())?.trim();
  await genderOptions.nth(genderIndex).click();
  console.log(`Selected gender: ${genderName}`);

  // ---------- 6. Email ----------
  await page.locator('#email').click();
  await page.locator('#email').fill(testData.email);
  await page.locator('#email').press('Tab');

  // ---------- 7. Mobile ----------
  await page.locator('#mobile').click();
  await page.locator('#mobile').fill(testData.mobile);

  console.log(`Using contact info: ${testData.name}, ${testData.email}, +971${testData.mobile}`);

  // ---------- 8. Preferred Language ----------
  const languageBlock = fieldBlock(page, 'Preferred Language');
  await languageBlock.locator('.select--container').click();

  const languageOptions = languageBlock.locator('.select--list li span');
  await expect(languageOptions.first()).toBeVisible({ timeout: 15000 });
  const languageCount = await languageOptions.count();
  expect(languageCount).toBeGreaterThan(0);

  const languageIndex = 0; // or randomize
  const languageName = (await languageOptions.nth(languageIndex).textContent())?.trim();
  await languageOptions.nth(languageIndex).click();

  await expect(languageBlock.locator('.select--list')).toBeHidden({ timeout: 5000 }).catch(() => {});
  console.log(`Selected language: ${languageName}`);

  // ---------- 9. Submit ----------
  await page.getByRole('button', { name: 'Book an Appointment' }).click();

  // Optional: assert confirmation
  // await expect(page.getByText('Appointment booked successfully')).toBeVisible();
});