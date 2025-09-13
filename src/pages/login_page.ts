import { expect, Locator, Page, test } from "@playwright/test";
import { RegisterPage } from "./register_page";
import { DashboardPage } from "./dashboard_page.ts";

export class LoginPage {
  readonly page: Page;
  readonly url = "https://tegb-frontend-88542200c6db.herokuapp.com/";
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
      "//button[@data-testid='register-button']"
    );
    this.successMessage = page.locator("//div[@class='success-message']");
  }

  async openPage(): Promise<this> {
    await this.page.goto(this.url);
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
}
