import { Page, Locator } from "@playwright/test";
import { LoginPage } from "./login_page";

export class RegisterPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly backButton: Locator;

  //constructor
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("//input[@data-testid='username-input']");
    this.passwordInput = page.locator("//input[@data-testid='password-input']");
    this.emailInput = page.locator("//input[@data-testid='email-input']");
    this.backButton = page.locator(
      "//div[@class='buttons-box']//button[@class='link-button']"
    );
    this.registerButton = page.locator(
      "//div[@class='buttons-box']//button[@data-testid='submit-button']"
    );
  }

  //methods
  async typeUsername(username: string): Promise<this> {
    await this.usernameInput.fill(username);
    return this;
  }

  async typeEmail(email: string): Promise<this> {
    await this.emailInput.fill(email);
    return this;
  }

  async typePassword(password: string): Promise<this> {
    await this.passwordInput.fill(password);
    return this;
  }

  async clickBack(): Promise<LoginPage> {
    await this.backButton.click();
    return new LoginPage(this.page);
  }

  async clickRegister(): Promise<LoginPage> {
    await this.registerButton.click();
    // TODO wait until registration sucesss?
    return new LoginPage(this.page);
  }

  async registerUser(password: string, email: string, username: string) {
    // TODO add step with description
    await this.typeUsername(username);
    await this.typePassword(password);
    await this.typeEmail(email);

    return this.clickRegister();
  }
}
