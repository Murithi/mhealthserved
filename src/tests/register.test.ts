// import { startServer } from "..";
import { request } from "graphql-request";
import { host } from "./constants";
import { createTypeormConn } from "../utils/createTypeormConnection";
import { User } from "../entity/User";

beforeAll(async () => {
  await createTypeormConn();
});
const email = "keith@bob.com";
const password = "jooiuiojk";
const username = "surveyor";

const mutation = `
mutation {
  register(email:"${email}", password:"${password}", username:"${username}")
}
`;
test("Register user", async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });

  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
