import { Page, Locator, expect } from "@playwright/test";
import { DashboardPage } from "./dashboard_page.ts";
import { User } from "../user/user.ts";

export class ProfilePage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly surnameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly ageInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator("//input[@data-testid='chage-name-input']");
    this.surnameInput = page.locator(
      "//input[@data-testid='chage-surname-input']",
    );
    this.emailInput = page.locator("//input[@data-testid='chage-email-input']");
    this.phoneInput = page.locator("//input[@data-testid='chage-phone-input']");
    this.ageInput = page.locator("//input[@data-testid='chage-age-input']");
    this.saveButton = page.locator("//button[@type='submit']");
  }

  async fillName(name: string): Promise<this> {
    await this.nameInput.fill(name);
    return this;
  }

  async fillSurname(surname: string): Promise<this> {
    await this.surnameInput.fill(surname);
    return this;
  }

  async fillEmail(email: string): Promise<this> {
    await this.emailInput.fill(email);
    return this;
  }

  async fillPhone(phone: string): Promise<this> {
    await this.phoneInput.fill(phone);
    return this;
  }

  async fillAge(age: string): Promise<this> {
    await this.ageInput.fill(age);
    return this;
  }

  async clickSaveProfile(): Promise<this> {
    await this.saveButton.click();
    return this;
  }

  async fillOutProfileFormAndSubmit(user: User) {
    await this.page.waitForLoadState("networkidle");
    await this.fillName(user.firstName);
    await this.fillSurname(user.lastName);
    await this.fillEmail(user.email);
    await this.fillPhone(user.phone);
    await this.fillAge(user.age);
    await this.clickSaveProfile();
    return new DashboardPage(this.page);
  }
}
