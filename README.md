# 🚀 Playwright Automation Framework

A scalable end-to-end test automation framework built with **Playwright** and **TypeScript**. This project follows industry best practices, including the Page Object Model (POM), reusable utilities, fixtures, reporting, and CI/CD integration.

---

## 📌 Tech Stack

- Playwright
- TypeScript
- Node.js
- Git & GitHub
- HTML Reports
- GitHub Actions (CI/CD)

---

## 📂 Project Structure

```
playwright-framework/
│
├── tests/                  # Test scripts
├── pages/                  # Page Object Model (POM)
├── fixtures/               # Custom fixtures
├── utils/                  # Utility/helper functions
├── test-data/              # Test data (JSON)
├── reports/                # Test reports
├── screenshots/            # Failure screenshots
├── playwright.config.ts    # Playwright configuration
├── package.json
├── tsconfig.json
├── .env
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Before running the project, make sure you have:

- Node.js (v18 or later)
- npm
- Git
- Visual Studio Code

Check versions:

```bash
node -v
npm -v
git --version
```

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/playwright-framework.git
```

Go to the project directory:

```bash
cd playwright-framework
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## ▶️ Running Tests

Run all tests:

```bash
npx playwright test
```

Run a specific test:

```bash
npx playwright test tests/login.spec.ts
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

Run tests in debug mode:

```bash
npx playwright test --debug
```

Open Playwright UI Mode:

```bash
npx playwright test --ui
```

---

## 📊 Test Reports

Generate the HTML report:

```bash
npx playwright show-report
```

The report includes:

- Test execution summary
- Pass/Fail status
- Screenshots (on failure)
- Trace viewer
- Execution duration

---

## 🎯 Framework Features

- Page Object Model (POM)
- TypeScript support
- Cross-browser testing
- Parallel execution
- Retry failed tests
- HTML reporting
- Trace Viewer
- Screenshot on failure
- Video recording
- Environment configuration
- Reusable utilities
- Fixtures
- Data-driven testing
- API testing
- CI/CD ready

---

## 🌐 Supported Browsers

- Chromium
- Firefox
- WebKit
- Microsoft Edge

---

## 📦 Useful Commands

Install Playwright:

```bash
npm init playwright@latest
```

Run tests:

```bash
npx playwright test
```

Run a single test file:

```bash
npx playwright test tests/example.spec.ts
```

Generate report:

```bash
npx playwright show-report
```

Run tests on Chromium only:

```bash
npx playwright test --project=chromium
```

Run tests with a specific tag:

```bash
npx playwright test --grep "@smoke"
```

---

## 🔄 CI/CD

This framework is CI/CD ready and can be integrated with:

- GitHub Actions
- Jenkins
- Azure DevOps
- GitLab CI
- Docker

---

## 📈 Future Enhancements

- Allure Reporting
- Slack Notifications
- Email Reports
- Docker Integration
- Jenkins Pipeline
- Azure DevOps Pipeline
- Database Validation
- Visual Regression Testing

---

## 👨‍💻 Author

**Manoj Sukale**

- Frontend Developer
- Playwright Automation Learner
- TypeScript Enthusiast

GitHub: https://github.com/your-username

---

## 📄 License

This project is for learning and demonstration purposes.
