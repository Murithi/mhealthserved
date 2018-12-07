// import { startServer } from "..";
import { request } from "graphql-request";
import { startServer } from "../../startServer";
import { User } from "../../entity/User";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "./errorMessages";

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
const password = "ipsos";
const username = "surveyor";

const mutation = (e: string, p: string, u: string) => `
mutation {
  register(email:"${e}", password:"${p}", username:"${u}"){
    path
    message
  }
}
`;
test("Register user", async () => {
  let host = await getHost();
  console.log(host);
  const response = await request(host, mutation(email, password, username));
  expect(response).toEqual({ register: null });

  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  // test for duplicate emails
  const response2: any = await request(
    host,
    mutation(email, password, username)
  );
  expect(response2.register).toHaveLength(1);
  expect(response2.register[0]).toEqual({
    path: "email",
    message: duplicateEmail
  });

  // catch bad email
  const response3: any = await request(host, mutation("b", password, username));
  expect(response3).toEqual({
    register: [
      {
        path: "email",
        message: emailNotLongEnough
      },
      {
        path: "email",
        message: invalidEmail
      }
    ]
  });

  // catch bad password
  const response4: any = await request(host, mutation(email, "ad", username));
  expect(response4).toEqual({
    register: [
      {
        path: "password",
        message: passwordNotLongEnough
      }
    ]
  });

  // catch bad password and bad email
  const response5: any = await request(host, mutation("df", "ad", username));
  expect(response5).toEqual({
    register: [
      {
        path: "email",
        message: emailNotLongEnough
      },
      {
        path: "email",
        message: invalidEmail
      },
      {
        path: "password",
        message: passwordNotLongEnough
      }
    ]
  });
});
