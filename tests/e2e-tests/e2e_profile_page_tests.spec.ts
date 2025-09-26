import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page.ts";
import { UserApi } from "../../src/api/user_api.ts";
import { User } from "../../src/user/user.ts";

test.describe("Profile E2E tests", () => {
  let testUser: User;

  test.beforeEach(async ({ page, request }) => {
    testUser = new User();
    testUser.generateFakeData();

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

    // create account via
    const userApi = new UserApi(request);
    await userApi
      .login(testUser.username, testUser.password)
      .then((userApi) => {
        userApi.createAccount(testUser.accountBalance);
      });
  });

  test("Should fill out profile, save data, and verify account balance", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage
      .openPage()
      .then((loginPage) =>
        loginPage.loginUser(testUser.username, testUser.password),
      )
      .then((dashboardPage) => dashboardPage.verifyDashboardLoaded())
      .then((dashboardPage) => dashboardPage.openProfileSetting())
      .then((profilePage) => profilePage.fillOutProfileFormAndSubmit(testUser))
      .then((dashboardPage) => dashboardPage.verifySavedProfileData(testUser))
      .then((dashboardPage) => dashboardPage.checkAccountCreated())
      .then((dashboardPage) =>
        dashboardPage.checkFirstAccountBalance(testUser.accountBalance),
      )
      .then((dashboardPage) => dashboardPage.logout());
  });
});
