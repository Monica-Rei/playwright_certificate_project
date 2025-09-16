import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page.ts";
import { DashboardPage } from "../../src/pages/dashboard_page.ts";
import { ProfilePage } from "../../src/pages/profile_page.ts";

test.describe("Atomic Tests: Check Dashboard Page", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage
      .openPage()
      .then((login) => login.fillUsername("user1"))
      .then((login) => login.fillPassword("user1"))
      .then((login) => login.clickLogin());
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.header).toBeVisible();
  });

  test("Modal Structure Tests", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await test.step("Title Header Tests", async () => {
      await expect(dashboardPage.logo).toBeVisible();
      await expect.soft(dashboardPage.header).toHaveText("TEG#B Dashboard");
    });

    await test.step("Left Dashboard Menu Tests", async () => {
      await expect.soft(dashboardPage.homeMenu).toBeVisible();
      await expect.soft(dashboardPage.homeMenu).toHaveText("Domů");
      await expect.soft(dashboardPage.accountsMenu).toBeVisible();
      await expect.soft(dashboardPage.accountsMenu).toHaveText("Účty");
      await expect.soft(dashboardPage.transactionsMenu).toBeVisible();
      await expect.soft(dashboardPage.transactionsMenu).toHaveText("Transakce");
      await expect.soft(dashboardPage.supportMenu).toBeVisible();
      await expect.soft(dashboardPage.supportMenu).toHaveText("Podpora");
    });

    await test.step("Profile Section Tests", async () => {
      await expect.soft(dashboardPage.profileHeader).toBeVisible();
      await expect
        .soft(dashboardPage.profileHeader)
        .toHaveText("Detaily Profilu");
      await expect.soft(dashboardPage.profileName).toBeVisible();
      await expect.soft(dashboardPage.profileName).toContainText("Jméno");
      await expect.soft(dashboardPage.profileSurname).toBeVisible();
      await expect.soft(dashboardPage.profileSurname).toContainText("Příjmení");
      await expect.soft(dashboardPage.profileEmail).toBeVisible();
      await expect.soft(dashboardPage.profileEmail).toContainText("Email");
      await expect.soft(dashboardPage.profilePhone).toBeVisible();
      await expect.soft(dashboardPage.profilePhone).toContainText("Telefon");
      await expect.soft(dashboardPage.profileAge).toBeVisible();
      await expect.soft(dashboardPage.profileAge).toContainText("Věk");
    });

    await test.step("Account Sections Tests", async () => {
      await expect.soft(dashboardPage.accountsHeader).toBeVisible();
      await expect.soft(dashboardPage.accountsHeader).toHaveText("Účty");
      await expect.soft(dashboardPage.accountNumberHeader).toBeVisible();
      await expect
        .soft(dashboardPage.accountNumberHeader)
        .toHaveText("Číslo účtu");
      await expect.soft(dashboardPage.balanceHeader).toBeVisible();
      await expect.soft(dashboardPage.balanceHeader).toHaveText("Zůstatek");
      await expect.soft(dashboardPage.accountTypeHeader).toBeVisible();
      await expect.soft(dashboardPage.accountTypeHeader).toHaveText("Typ účtu");
    });

    await test.step("Buttons Structure Tests", async () => {
      await expect.soft(dashboardPage.profileButton).toBeVisible();
      await expect
        .soft(dashboardPage.profileButton)
        .toHaveText("Upravit profil");
      await expect.soft(dashboardPage.logoutButton).toBeVisible();
      await expect.soft(dashboardPage.logoutButton).toHaveText("Odhlásit se");
      await expect.soft(dashboardPage.addAccountButton).toBeVisible();
      await expect
        .soft(dashboardPage.addAccountButton)
        .toHaveText("Přidat účet");
    });
  });

  test("Click Logout Button Test", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await expect(dashboardPage.logoutButton).toBeVisible();
    await expect(dashboardPage.logoutButton).toHaveText("Odhlásit se");

    await dashboardPage.clickLogout();
  });

  test("Click Add Account Button Test", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await expect(dashboardPage.addAccountButton).toBeVisible();
    await expect(dashboardPage.addAccountButton).toHaveText("Přidat účet");

    await dashboardPage.clickAddAccount();
  });

  test("Click Profile Button Test", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await expect(dashboardPage.profileButton).toBeVisible();
    await expect(dashboardPage.profileButton).toHaveText("Upravit profil");

    const profilePage = await dashboardPage.openProfileSetting();
    await expect(profilePage.nameInput).toBeVisible(); // sanity check
  });
});
