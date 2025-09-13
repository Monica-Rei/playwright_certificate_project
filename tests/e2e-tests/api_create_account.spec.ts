import { expect, test } from "@playwright/test";
import { DashboardPage } from "../../src/pages/dashboard_page.ts";

test("Create account on Dashboard using API", async ({ page, request }) => {
  const username = "user1";
  const password = "user1";

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
  const accountResponseBody = await accountResponse.json();
});
