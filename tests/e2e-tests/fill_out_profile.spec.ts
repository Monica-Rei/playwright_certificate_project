import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page";
import { DashboardPage } from "../../src/pages/dashboard_page";
import { ProfilePage } from "../../src/pages/profile_page.ts";
import { faker } from "@faker-js/faker";
import { RegisterPage } from "../../src/pages/register_page.ts";

const BASE_URL = "https://tegb-backend-877a0b063d29.herokuapp.com/tegb";

const ballance = 10000;

type UserData = {
  username: string;
  password: string;
  email: string;
};

function generateUserData(): UserData {
  return {
    username: faker.internet.username(),
    password: faker.internet.password(),
    email: faker.internet.email(),
  };
}

async function registerUser(page, userData: UserData) {
  const loginPage = new LoginPage(page);
  const registerPage = new RegisterPage(page);

  await loginPage.openPage();
  await loginPage.clickRegister();

  await registerPage.typeUsername(userData.username);
  await registerPage.typePassword(userData.password);
  await registerPage.typeEmail(userData.email);

  await registerPage.clickRegister();
  await loginPage.expectSuccessMessage("Registrace úspěšná! Vítejte v TEG#B!");
}

async function loginViaApi(request, userData: UserData) {
  const loginResponse = await request.post(`${BASE_URL}/login`, {
    headers: { "Content-Type": "application/json" },
    data: { username: userData.username, password: userData.password },
  });

  expect(loginResponse.status()).toBe(201);
  const loginResponseBody = await loginResponse.json();
  const accessToken = loginResponseBody.access_token;
  expect(accessToken).toBeTruthy();
  return accessToken;
}

async function createAccountViaApi(request, userData: UserData) {
  const accessToken = await loginViaApi(request, userData);
  const accountResponse = await request.post(`${BASE_URL}/accounts/create`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      startBalance: ballance,
      type: "Test",
    },
  });
  expect(accountResponse.status()).toBe(201);
}

async function loginUser(page, userData: UserData) {
  const dashboardPage = new DashboardPage(page);
  const loginPage = new LoginPage(page);

  await loginPage.openPage();
  await loginPage.fillUsername(userData.username);
  await loginPage.fillPassword(userData.password);
  await loginPage.clickLogin();
  await dashboardPage.expectDashboardLoaded();
}

function generateProfileInformation(email: string) {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email,
    phone: faker.helpers.replaceSymbols("###-###-####"),
    age: faker.number.int({ min: 18, max: 80 }).toString(),
  };
}

test.describe("Profile tests", () => {
  let userData: UserData;

  test.beforeEach(async ({ page, request }) => {
    userData = generateUserData();

    await registerUser(page, userData);

    await createAccountViaApi(request, userData);

    await loginUser(page, userData);
  });

  test("Fill out profile and verify saved data", async ({ page }) => {
    const profileInformation = generateProfileInformation(userData.email);
    const profilePage = new ProfilePage(page);
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.openProfileSetting();
    await profilePage.fillOutProfileFormAndSubmit(profileInformation);

    await expect(dashboardPage.profileName).toContainText(
      profileInformation.firstName
    );
    await expect(dashboardPage.profileSurname).toContainText(
      profileInformation.lastName
    );
    await expect(dashboardPage.profileEmail).toContainText(
      profileInformation.email
    );
    await expect(dashboardPage.profilePhone).toContainText(
      profileInformation.phone
    );
    await expect(dashboardPage.profileAge).toContainText(
      profileInformation.age
    );

    await dashboardPage.checkAccountCreated();
    await dashboardPage.checkFirstAccountBalance(ballance);
  });
});
