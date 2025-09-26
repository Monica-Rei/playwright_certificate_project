import test, { APIRequestContext, APIResponse, expect } from "@playwright/test";

export class UserApi {
  readonly request: APIRequestContext;
  readonly apiUrl = process.env.USER_API_BASE_URL;
  accessToken: string;
  username: string;
  userPassword: string;
  loginResponse: APIResponse;
  registerResponse: APIResponse;
  createAccountResponse: APIResponse;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async register(
    email: string,
    username: string,
    password: string,
  ): Promise<this> {
    await test.step("API call: Register a new user", async () => {
      const registerResponse = await this.request.post(
        `${this.apiUrl}/register`,
        {
          headers: { "Content-Type": "application/json" },
          data: { email, username, password },
        },
      );
      this.registerResponse = registerResponse;

      await expect(registerResponse.status()).toBe(201);
      this.username = username;
      this.userPassword = password;
    });
    return this;
  }

  async login(username: string, password: string): Promise<this> {
    await test.step("API call: login a user", async () => {
      const loginResponse = await this.request.post(`${this.apiUrl}/login`, {
        headers: { "Content-Type": "application/json" },
        data: { username, password },
      });
      this.loginResponse = loginResponse;

      await expect(loginResponse.status()).toBe(201);
      const loginResponseBody = await loginResponse.json();
      const accessToken = loginResponseBody.access_token;
      await expect(accessToken).toBeTruthy();
      this.accessToken = accessToken;
      this.username = username;
      this.userPassword = password;
    });
    return this;
  }

  async createAccount(startBalance: number): Promise<this> {
    await test.step("API call: create an account with starting balance", async () => {
      const createAccountResponse = await this.request.post(
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
        },
      );
      this.createAccountResponse = createAccountResponse;

      await expect(createAccountResponse.status()).toBe(201);
    });
    return this;
  }
}
