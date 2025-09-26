import { APIRequestContext, APIResponse, expect } from "@playwright/test";

export class UserApi {
  readonly request: APIRequestContext;
  readonly apiUrl = "https://tegb-backend-877a0b063d29.herokuapp.com/tegb";
  accessToken: string;
  username: string;
  userPassword: string;
  loginResponse: APIResponse;
  registerResponse: APIResponse;
  createAccountResponse: APIResponse;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async register(email: string, username: string, password: string) {
    const registerResponse = await this.request.post(
      `${this.apiUrl}/register`,
      {
        headers: { "Content-Type": "application/json" },
        data: { email, username, password },
      }
    );
    this.registerResponse = registerResponse;

    await expect(registerResponse.status()).toBe(201);
    this.username = username;
    this.userPassword = password;
    return this;
  }

  async login(username: string, password: string) {
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
    return this;
  }

  async createAccount(startBalance: number) {
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
      }
    );
    this.createAccountResponse = createAccountResponse;

    await expect(createAccountResponse.status()).toBe(201);
    return this;
  }
}
