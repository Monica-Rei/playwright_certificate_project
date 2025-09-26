import { test, expect } from "@playwright/test";
import { UserApi } from "../../src/api/user_api.ts";
import { User } from "../../src/user/user.ts";

test("API user login test", async ({ request }) => {
  const testUser = new User();
  testUser.generateFakeData();

  const userApi = new UserApi(request);
  await userApi
    .register(testUser.email, testUser.username, testUser.password)
    .then((userApi) => userApi.login(testUser.username, testUser.password));

  expect(userApi.loginResponse.status()).toBe(201);
  expect(userApi.accessToken).toBeTruthy();
});
