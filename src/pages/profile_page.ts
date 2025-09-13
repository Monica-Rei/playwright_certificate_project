import { Page, Locator } from "@playwright/test";

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
      "//input[@data-testid='chage-surname-input']"
    );
    this.emailInput = page.locator("//input[@data-testid='chage-email-input']");
    this.phoneInput = page.locator("//input[@data-testid='chage-phone-input']");
    this.ageInput = page.locator("//input[@data-testid='chage-age-input']");
    this.saveButton = page.locator("//button[@type='submit']");
  }

  private async clearAndFill(input: Locator, value: string) {
    await input.waitFor({ state: "visible" });
    await input.fill(value);

    // // Dispatch input a change event, aby frontend zachytil změnu
    // await input.evaluate((el, val) => {
    //   (el as HTMLInputElement).value = val;
    //   el.dispatchEvent(new Event("input", { bubbles: true }));
    //   el.dispatchEvent(new Event("change", { bubbles: true }));
    // }, value);

    // await this.page.keyboard.press("Tab"); // trigger blur
  }

  async fillName(name: string): Promise<this> {
    await this.clearAndFill(this.nameInput, name);
    return this;
  }

  async fillSurname(surname: string): Promise<this> {
    await this.clearAndFill(this.surnameInput, surname);
    return this;
  }

  async fillEmail(email: string): Promise<this> {
    await this.clearAndFill(this.emailInput, email);
    return this;
  }

  async fillPhone(phone: string): Promise<this> {
    await this.clearAndFill(this.phoneInput, phone);
    return this;
  }

  async fillAge(age: string): Promise<this> {
    await this.clearAndFill(this.ageInput, age);
    return this;
  }

  async clickSaveProfile(): Promise<this> {
    await this.saveButton.click();
    return this;
  }

  async fillOutProfileForm(profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: string;
  }): Promise<this> {
    await this.page.waitForLoadState("networkidle");
    await this.fillName(profileData.firstName);
    await this.fillSurname(profileData.lastName);
    await this.fillEmail(profileData.email);
    await this.fillPhone(profileData.phone);
    await this.fillAge(profileData.age);
    await this.clickSaveProfile();
    return this;
  }
}
