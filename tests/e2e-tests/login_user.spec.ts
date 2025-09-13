import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page";
import { DashboardPage } from "../../src/pages/dashboard_page";

test("Login User", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.openPage();

  //await loginPage.fillUsername(User.getInstance().username); -> nefunguje
  //await loginPage.fillPassword(User.getInstance().password);

  await loginPage.fillUsername("user1"); //upravit aby to nebylo hardcoded
  await loginPage.fillPassword("user1");

  await loginPage.clickLogin();
  await dashboardPage.expectDashboardLoaded();
});
