import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page";
import { DashboardPage } from "../../src/pages/dashboard_page";
import { ProfilePage } from "../../src/pages/profile_page.ts";
import { faker } from "@faker-js/faker";
import { RegisterPage } from "../../src/pages/register_page.ts";

const BASE_URL = "https://tegb-backend-877a0b063d29.herokuapp.com/tegb";

function generateUserData() {
  return {
    username: faker.internet.username(),
    password: faker.internet.password(),
    email: faker.internet.email(),
  };
}

async function registerUser(page, userData) {
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

async function loginViaApi(request, userData) {
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

async function createAccountViaApi(request, accessToken) {
  const accountResponse = await request.post(`${BASE_URL}/accounts/create`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      startBalance: 10000,
      type: "Test",
    },
  });
  expect(accountResponse.status()).toBe(201);
}

async function loginUser(page, userData) {
  const loginPage = new LoginPage(page);
  await loginPage.openPage();
  await loginPage.fillUsername(userData.username);
  await loginPage.fillPassword(userData.password);
  await loginPage.clickLogin();
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
  let userData;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page, request }) => {
    userData = generateUserData();

    await registerUser(page, userData);

    const accessToken = await loginViaApi(request, userData);
    await createAccountViaApi(request, accessToken);

    dashboardPage = new DashboardPage(page);
    await loginUser(page, userData);
    await dashboardPage.expectDashboardLoaded();
  });

  test("Fill out profile and verify saved data", async ({ page }) => {
    const profileInformation = generateProfileInformation(userData.email);
    const profilePage = new ProfilePage(page);

    await dashboardPage.openProfileSetting();
    await profilePage.fillOutProfileForm(profileInformation);

    expect(await dashboardPage.profileName.textContent()).toContain(
      profileInformation.firstName
    );
    expect(await dashboardPage.profileSurname.textContent()).toContain(
      profileInformation.lastName
    );
    expect(await dashboardPage.profileEmail.textContent()).toContain(
      profileInformation.email
    );
    expect(await dashboardPage.profilePhone.textContent()).toContain(
      profileInformation.phone
    );
    expect(await dashboardPage.profileAge.textContent()).toContain(
      profileInformation.age
    );
  });
});
