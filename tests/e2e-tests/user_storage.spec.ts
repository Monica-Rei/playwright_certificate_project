import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page";
import { DashboardPage } from "../../src/pages/dashboard_page";

setup("store authenticated state", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.openPage();
  await loginPage.fillUsername("user1");
  await loginPage.fillPassword("user1");
  await loginPage.clickLogin();

  // počkej na prvek, který se zobrazí jen po loginu
  await dashboardPage.expectDashboardLoaded();

  // teprve teď uložit session
  await page.context().storageState({ path: "storageState.json" });
});
