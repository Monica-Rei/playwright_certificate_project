export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TEST_ACCOUNT_USERNAME: string;
      TEST_ACCOUNT_PASSWORD: string;
      USER_API_BASE_URL: string;
      APP_BASE_URL: string;
    }
  }
}
