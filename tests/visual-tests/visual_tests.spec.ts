import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page.ts";
import { DashboardPage } from "../../src/pages/dashboard_page.ts";

test.describe("Visual Tests: Check Profile Section", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage
      .openPage()
      .then((loginPage) =>
        loginPage.loginUser(
          process.env.TEST_ACCOUNT_USERNAME,
          process.env.TEST_ACCOUNT_PASSWORD,
        ),
      );
  });

  test("Elements Visual Tests", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await expect(dashboardPage.profileDetailsTitle).toHaveScreenshot(
      "div_test.png",
    );

    await expect(dashboardPage.profileName).toHaveScreenshot(
      "input_name_test.png",
    );
    await expect(dashboardPage.profileSurname).toHaveScreenshot(
      "input_surname_test.png",
    );
    await expect(dashboardPage.profileEmail).toHaveScreenshot(
      "input_email_test.png",
    );
    await expect(dashboardPage.profilePhone).toHaveScreenshot(
      "input_phone_test.png",
    );
    await expect(dashboardPage.profileAge).toHaveScreenshot(
      "input_age_test.png",
    );
    await expect(dashboardPage.profileHeader).toHaveScreenshot(
      "profile_header_test.png",
    );
  });
});
