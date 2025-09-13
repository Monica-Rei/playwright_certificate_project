import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page.ts";
import { DashboardPage } from "../../src/pages/dashboard_page.ts";
import { ProfilePage } from "../../src/pages/profile_page.ts";

test.describe("Account tests", () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.openPage();
    await loginPage.fillUsername("user1");
    await loginPage.fillPassword("user1");
    await loginPage.clickLogin();
    await dashboardPage.expectDashboardLoaded();
  });

  test("Check Acocunt Information", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const profilePage = new ProfilePage(page);

    await dashboardPage.openProfileSetting();

    await dashboardPage.checkAccountCreated();
    await dashboardPage.checkFirstAccountBalance(10000.0);
  });
});
