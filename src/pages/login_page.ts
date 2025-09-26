import test, { expect, Locator, Page } from "@playwright/test";
import { RegisterPage } from "./register_page";
import { DashboardPage } from "./dashboard_page.ts";

export class LoginPage {
  readonly page: Page;
  readonly url = process.env.APP_BASE_URL;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("//input[@data-testid='username-input']");
    this.passwordInput = page.locator("//input[@data-testid='password-input']");
    this.loginButton = page.locator("//button[@data-testid='submit-button']");
    this.registerButton = page.locator(
      "//button[@data-testid='register-button']",
    );
    this.successMessage = page.locator("//div[@class='success-message']");
  }

  async openPage(): Promise<this> {
    await test.step("Open login page", async () => {
      await this.page.goto(this.url);
    });
    return this;
  }

  async clickRegister(): Promise<RegisterPage> {
    await this.registerButton.click();
    return new RegisterPage(this.page);
  }

  async clickLogin(): Promise<DashboardPage> {
    await this.loginButton.click();
    return new DashboardPage(this.page);
  }

  async fillUsername(username: string): Promise<this> {
    await this.usernameInput.fill(username);
    return this;
  }

  async fillPassword(password: string): Promise<this> {
    await this.passwordInput.fill(password);
    return this;
  }

  async expectSuccessMessage(expectedText: string): Promise<this> {
    await expect(this.successMessage).toContainText(expectedText);
    return this;
  }

  async loginUser(username: string, password: string): Promise<DashboardPage> {
    return await test.step("Login user", async () => {
      await this.fillUsername(username);
      await this.fillPassword(password);

      return await this.clickLogin().then((dashboardPage) =>
        dashboardPage.verifyDashboardLoaded(),
      );
    });
  }

  async verifyOnLoginPage(): Promise<this> {
    await test.step("Verify on Login Page", async () => {
      await expect(this.page).toHaveURL(this.url);
      await expect(this.usernameInput).toBeVisible();
      await expect(this.passwordInput).toBeVisible();
      await expect(this.loginButton).toBeVisible();
    });
    return this;
  }
}
