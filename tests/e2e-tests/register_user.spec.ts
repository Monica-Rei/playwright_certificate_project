import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page";
import { RegisterPage } from "../../src/pages/register_page";
import { faker } from "@faker-js/faker";
//import { User } from "../../src/storage/user";

test("Register User", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const registerPage = new RegisterPage(page);

  await loginPage.openPage();
  await loginPage.clickRegister();

  //await registerPage.typeUsername(User.getInstance().username);
  //await registerPage.typePassword(User.getInstance().password);
  //await registerPage.typeEmail(User.getInstance().email);

  await registerPage.typeUsername(faker.internet.username());
  await registerPage.typePassword(faker.internet.password());
  await registerPage.typeEmail(faker.internet.email());

  await registerPage.clickRegister();
  await loginPage.expectSuccessMessage("Registrace úspěšná! Vítejte v TEG#B!");
});
