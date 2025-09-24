import { expect, Locator, Page } from "@playwright/test";

export class AccountInfoPage {
  readonly page: Page;
  readonly accountNameDiv: Locator;
  readonly dateAddedTd: Locator;
  readonly startDateTd: Locator;
  readonly statusDiv: Locator;
  readonly priorityDiv: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountNameDiv = page.locator(".portlet-title .caption");
    this.dateAddedTd = page.locator('//th[text()="Date Added"]/../td');
    this.startDateTd = page.locator('//th[text()="Start Date"]/../td');
    this.statusDiv = page.locator('//th[text()="Status"]/..//div');
    this.priorityDiv = page.locator('//th[text()="Priority"]/..//div');
  }

  async accountNameHaveText(accountName: string): Promise<this> {
    await expect
      .soft(this.accountNameDiv, "Account Name have Text")
      .toHaveText(accountName);
    return this;
  }

  async dateAddedContainsDate(addedDate: string): Promise<this> {
    await expect
      .soft(this.dateAddedTd, "Date Added have Text")
      .toContainText(addedDate);
    return this;
  }

  async startDateHaveText(startDate: string): Promise<this> {
    await expect
      .soft(this.startDateTd, "Start Date have Text")
      .toContainText(startDate);
    return this;
  }

  async statusHaveText(status: string): Promise<this> {
    await expect.soft(this.statusDiv, "Status have text").toHaveText(status);
    return this;
  }

  async priorityHaveText(priority: string): Promise<this> {
    await expect
      .soft(this.priorityDiv, "Priority have Text")
      .toHaveText(priority);
    return this;
  }
}
