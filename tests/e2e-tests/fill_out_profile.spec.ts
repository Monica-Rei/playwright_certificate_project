import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page";
import { DashboardPage } from "../../src/pages/dashboard_page";
import { ProfilePage } from "../../src/pages/profile_page.ts";
import { faker } from "@faker-js/faker";
import { RegisterPage } from "../../src/pages/register_page.ts";

const username: string = faker.internet.username();
const password: string = faker.internet.password();
const email: string = faker.internet.email();

test.describe("Profile tests", () => {
  let dashboardPage: DashboardPage;
  let profileInformation: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: string;
  };

  test.beforeEach(async ({ page, request }) => {
    // register new user
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    await loginPage.openPage();
    await loginPage.clickRegister();

    await registerPage.typeUsername(username);
    await registerPage.typePassword(password);
    await registerPage.typeEmail(faker.internet.email());

    await registerPage.clickRegister();
    await loginPage.expectSuccessMessage(
      "Registrace úspěšná! Vítejte v TEG#B!"
    );

    // create account for new user

    // --- Login přes API ---
    const loginResponse = await request.post(
      "https://tegb-backend-877a0b063d29.herokuapp.com/tegb/login",
      {
        headers: { "Content-Type": "application/json" },
        data: { username, password },
      }
    );

    expect(loginResponse.status()).toBe(201);

    const loginResponseBody = await loginResponse.json();
    const accessToken = loginResponseBody.access_token;
    expect(accessToken).toBeTruthy();

    // --- Vytvoření účtu přes API ---
    const accountResponse = await request.post(
      "https://tegb-backend-877a0b063d29.herokuapp.com/tegb/accounts/create",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          startBalance: 10000,
          type: "Test",
        },
      }
    );

    expect(accountResponse.status()).toBe(201);
    // const accountResponseBody = await accountResponse.json();

    // login with registered user

    dashboardPage = new DashboardPage(page);

    await loginPage.openPage();
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
    await loginPage.clickLogin();
    await dashboardPage.expectDashboardLoaded();

    profileInformation = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: email,
      phone: faker.helpers.replaceSymbols("###-###-####"),
      age: faker.number.int({ min: 18, max: 80 }).toString(),
    };
  });

  test("Fill out profile and verify saved data", async ({ page }) => {
    const profilePage = new ProfilePage(page);

    await dashboardPage.openProfileSetting();

    // Vyplnění formuláře
    await profilePage.fillOutProfileForm(profileInformation);

    // Po uložení ověřujeme přes dashboard (zobrazené hodnoty), ne přes inputy
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
  });
});
