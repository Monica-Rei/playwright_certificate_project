import { faker } from "@faker-js/faker";

export class User {
  username: string;
  password: string;
  email: string;
  accountBalance: number;
  firstName: string;
  lastName: string;
  phone: string;
  age: string;

  constructor() {}

  public generateFakeData() {
    this.username = faker.internet.username();
    this.password = faker.internet.password();
    this.email = faker.internet.email();
    this.accountBalance = 10000;
    this.firstName = faker.person.firstName();
    this.lastName = faker.person.lastName();
    this.phone = faker.helpers.replaceSymbols("###-###-####");
    this.age = faker.number.int({ min: 18, max: 80 }).toString();
  }
}
