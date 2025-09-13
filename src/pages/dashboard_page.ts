import { expect, Locator, Page, test } from "@playwright/test";
import { ProfilePage } from "./profile_page.ts";

export class DashboardPage {
  readonly page: Page;
  readonly header: Locator;
  readonly profileButton: Locator;
  readonly firstAccount: Locator;
  readonly firstAccountBalance: Locator;
  readonly profileName: Locator;
  readonly profileSurname: Locator;
  readonly profileEmail: Locator;
  readonly profilePhone: Locator;
  readonly profileAge: Locator;

  //constructor
  constructor(page: Page) {
    this.page = page;
    this.header = this.page.locator("//span[@class='app-title']");
    this.profileButton = this.page.locator(
      "//button[@data-testid='toggle-edit-profile-button']"
    );
    //upravit xpath aby tam nebylo 0 ???
    this.firstAccount = this.page.locator("//tr[@data-testid='account-row-0']");
    this.firstAccountBalance = this.page.locator(
      "//tr[@data-testid='account-row-0']//td[@data-testid='account-balance']"
    );
    this.profileName = this.page.locator("//div[@data-testid='name']");
    this.profileSurname = this.page.locator("//div[@data-testid='surname']");
    this.profileEmail = this.page.locator("//div[@data-testid='email']");
    this.profilePhone = this.page.locator("//div[@data-testid='phone']");
    this.profileAge = this.page.locator("//div[@data-testid='age']");
  }

  async expectDashboardLoaded(): Promise<this> {
    await expect(this.header).toContainText("Dashboard");
    return this;
  }

  async openProfileSetting(): Promise<ProfilePage> {
    await this.profileButton.click();
    return new ProfilePage(this.page);
  }

  async checkAccountCreated(): Promise<this> {
    await expect(this.firstAccount).toBeVisible();
    return this;
  }

  async checkFirstAccountBalance(expectedBalance: number): Promise<this> {
    const formattedBalance = expectedBalance.toFixed(2); // převede 10000 -> "10000.00"
    await expect(this.firstAccountBalance).toContainText(formattedBalance);
    return this;
  }
}
