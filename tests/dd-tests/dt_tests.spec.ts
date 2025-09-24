import newAccountData from "../../src/assets/new_account_data.json";
import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page.ts";
import { DashboardPage } from "../../src/pages/dashboard_page.ts";

test.describe("Data Driven Tests", () => {
  newAccountData.forEach((accountData, index) => {
    test(`${index + 1} DDT: Create Account ${accountData.description}`, async ({
      page,
    }) => {
      const accountName =
        accountData.name_prefix + faker.number.int({ max: 99999 });
      const startDate = getStartDate(accountData.start_date, "YYYY-MM-DD");
      const startDateAccountInfo = getStartDate(
        accountData.start_date,
        "DD/MM/YYYY"
      );
      const addedDate = dayjs().format("DD/MM/YYYY");
      console.log("Generated account name: " + accountName);
      console.log(`Start date for ${accountData.start_date}: ${startDate}`);
      console.log(
        `Assert start date for ${accountData.start_date}: ${startDateAccountInfo}`
      );
      console.log(`Added date: ${addedDate}`);

      const loginPage = new LoginPage(page);
      await loginPage
        .openPmtool()
        .then((login) => login.login("pw_academy", "Playwright321!"))
        .then((dashboard) => dashboard.clickProjects())
        .then((projects) => projects.clickAddProject())
        .then((newProject) =>
          newProject.selectPriorityByLabel(projectData.priority)
        )
        .then((newProject) =>
          newProject.selectStatusByLabel(projectData.status)
        )
        .then((newProject) => newProject.fillName(projectName))
        .then((newProject) => newProject.fillStartDate(startDate))
        .then((newProject) => newProject.clickSave())
        .then((tasks) => tasks.clickProjectInfo())
        .then((projectInfo) => projectInfo.projectNameHaveText(projectName))
        .then((projectInfo) =>
          projectInfo.startDateHaveText(startDateProjectInfo)
        )
        .then((projectInfo) =>
          projectInfo.priorityHaveText(projectData.priority)
        )
        .then((projectInfo) => projectInfo.statusHaveText(projectData.status))
        .then((projectInfo) => projectInfo.dateAddedContainsDate(addedDate));
    });
  });
});

function getStartDate(startDate: string, format: string): string {
  let formattedStartDate = "$INVALID_DATE";
  switch (startDate) {
    case "today":
      formattedStartDate = dayjs().format(format);
      break;
    case "tomorrow":
      formattedStartDate = dayjs().add(1, "day").format(format);
      break;
    case "yesterday":
      formattedStartDate = dayjs().subtract(1, "day").format(format);
      break;
    default:
      expect(
        false,
        "Error: getStartDate() - invalid startDate string, only allowed values: 'today', 'tomorrow', 'yesterday'"
      ).toBeTruthy();
  }
  return formattedStartDate;
}
