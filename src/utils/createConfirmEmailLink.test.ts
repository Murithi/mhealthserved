import * as Redis from "ioredis";
import fetch from "node-fetch";
import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeormConn } from "./createTypeormConnection";
import { User } from "../entity/User";

let userId = "";
const redis = new Redis();
beforeAll(async () => {
  await createTypeormConn();
  const user = await User.create({
    email: "bib@gmail.com",
    username: "bibi",
    password: "cantalope"
  }).save();
  userId = user.id;
});
describe("test createConfirmEmailLink", () => {
  test("should ensure user is confirmed and key is cleared from redis", async () => {
    const url = await createConfirmEmailLink(
      process.env.TEST_HOST as string,
      userId,
      redis
    );
    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual("ok");
    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();
    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];
    const value = await redis.get(key);
    expect(value).toBeNull();
  });

  test("should send invalid if bad id sent", async () => {
    const response = await fetch(`${process.env.TEST_HOST}/confirm/12987`);
    const text = await response.text();
    expect(text).toEqual("invalid");
  });
});
