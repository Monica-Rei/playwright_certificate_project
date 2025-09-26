import accountBalanceData from "../../src/assets/account_balance_data.json";
import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page.ts";
import { User } from "../../src/user/user.ts";
import { UserApi } from "../../src/api/user_api.ts";

test.describe("Data Driven Tests", () => {
  accountBalanceData.forEach((account, index) => {
    test(`${index + 1} DDT: Acount Balance: ${account.description}`, async ({
      page,
      request,
    }) => {
      const testUser = new User();
      testUser.generateFakeData();
      testUser.accountBalance = account.balance;

      const loginPage = new LoginPage(page);

      // register user
      await loginPage
        .openPage()
        .then((loginPage) => loginPage.clickRegister())
        .then((registerPage) =>
          registerPage.registerUser(
            testUser.password,
            testUser.email,
            testUser.username,
          ),
        );

      // create account via for registered user
      const userApi = new UserApi(request);
      await userApi
        .login(testUser.username, testUser.password)
        .then((userApi) => {
          userApi.createAccount(testUser.accountBalance);
        });

      // verify account balance
      await loginPage
        .openPage()
        .then((loginPage) =>
          loginPage.loginUser(testUser.username, testUser.password),
        )
        .then((dashboardPage) => dashboardPage.verifyDashboardLoaded())
        .then((dashboardPage) => dashboardPage.checkAccountCreated())
        .then((dashboardPage) =>
          dashboardPage.checkFirstAccountBalance(testUser.accountBalance),
        )
        .then((dashboardPage) => dashboardPage.logout());
    });
  });
});
