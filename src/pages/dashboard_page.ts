import { expect, Locator, Page, test } from "@playwright/test";
import { ProfilePage } from "./profile_page.ts";
import { LoginPage } from "./login_page.ts";

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
  readonly logoutButton: Locator;
  readonly logo: Locator;
  readonly homeMenu: Locator;
  readonly accountsMenu: Locator;
  readonly transactionsMenu: Locator;
  readonly supportMenu: Locator;
  readonly profileHeader: Locator;
  readonly accountsHeader: Locator;
  readonly accountNumberHeader: Locator;
  readonly balanceHeader: Locator;
  readonly accountTypeHeader: Locator;
  readonly addAccountButton: Locator;

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
    this.logoutButton = this.page.locator("//button[@class='logout-link']");
    this.logo = this.page.locator("//img[@alt='Tredgate Logo']");
    this.homeMenu = this.page.locator("//nav//ul//li[1]");
    this.accountsMenu = this.page.locator("//nav//ul//li[2]");
    this.transactionsMenu = this.page.locator("//nav//ul//li[3]");
    this.supportMenu = this.page.locator("//nav//ul//li[4]");
    this.profileHeader = this.page.locator(
      "//h2[@data-testid='profile-details-title']"
    );
    this.accountsHeader = this.page.locator(
      "//h2[@data-testid='accounts-title']"
    );
    this.accountNumberHeader = this.page.locator(
      "//tr[@class='account-heading']//th[@data-testid='account-number-heading']"
    );
    this.balanceHeader = this.page.locator(
      "//tr[@class='account-heading']//th[@data-testid='account-balance-heading']"
    );
    this.accountTypeHeader = this.page.locator(
      "//tr[@class='account-heading']//th[@data-testid='account-type-heading']"
    );
    this.addAccountButton = this.page.locator(
      "//button[@class='account-action']"
    );
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
  async clickLogout(): Promise<LoginPage> {
    await this.logoutButton.click();
    return new LoginPage(this.page);
  }

  async clickAddAccount(): Promise<this> {
    await this.addAccountButton.click();
    return this;
  }
  /*tlacitko nefunguje, proto jsem tam dala <this> ... pokud by fungovalo, test by byl takhle

  async clickAddAccount(): Promise<AccountPage> {
    await this.addAccountButton.click();
    return new AccountPage(this.page);
  }*/
}
