// import { startServer } from "..";
import { request } from "graphql-request";
import { startServer } from "../../startServer";
import { User } from "../../entity/User";

interface AddressInfo {
  address: string;
  family: string;
  port: number;
}
let getHost = () => "";
beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port}`;
});
const email = "keith@bob.com";
const password = "jooiuiojk";
const username = "surveyor";

const mutation = `
mutation {
  register(email:"${email}", password:"${password}", username:"${username}"){
    path
    message
  }
}
`;
test("Register user", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: null });

  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  const response2: any = await request(getHost(), mutation);
  expect(response2.register).toHaveLength(1);
  expect(response2.register[0].path).toEqual("email");
});
