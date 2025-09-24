import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

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

export class UserApi {
  readonly request: APIRequestContext;
  readonly apiUrl = "https://tegb-backend-877a0b063d29.herokuapp.com/tegb";
  accessToken: string;
  username: string;
  userPassword: string;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async loginViaApi(username: string, password: string) {
    const loginResponse = await this.request.post(`${this.apiUrl}/login`, {
      headers: { "Content-Type": "application/json" },
      data: { username, password },
    });

    expect(loginResponse.status()).toBe(201);
    const loginResponseBody = await loginResponse.json();
    const accessToken = loginResponseBody.access_token;
    expect(accessToken).toBeTruthy();
    this.accessToken = accessToken;
    this.username = username;
    this.userPassword = password;
    return this;
  }

  async createAccountViaApi(startBalance: number) {
    const accountResponse = await this.request.post(
      `${this.apiUrl}/accounts/create`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        data: {
          startBalance: startBalance,
          type: "Test",
        },
      }
    );
    expect(accountResponse.status()).toBe(201);
    return this;
  }
}
