import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../lib/models/User";
import * as dummyData from "./dummyData/users";
import { MongoError } from "mongodb";

dotenv.config();

describe("User model tests", () => {
  beforeAll(async () => {
    const databaseURL = process.env.USERMODEL_TESTDB_URL;
    await mongoose.connect(databaseURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("Should create and save a new user", async () => {
    const validUser = new User(dummyData.user);
    const savedUser = await validUser.save();
    const password = dummyData.user.password;
    const savedPassword = savedUser.password;
    const compare = bcrypt.compare;

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(dummyData.user.email);
    expect(await compare(password, savedPassword)).toBe(true);
  });

  it("should fail with blank fields", () => {
    const blankUser = new User(dummyData.blankUser);
    expect(blankUser.save()).rejects.toBeInstanceOf(mongoose.Error);
  });

  it("should fail with blank email", () => {
    const blankEmail = new User(dummyData.blankEmail);
    expect(blankEmail.save()).rejects.toBeInstanceOf(mongoose.Error);
  });

  it("should fail with blank password", () => {
    const blankPassword = new User(dummyData.blankPassword);
    expect(blankPassword.save()).rejects.toBeInstanceOf(mongoose.Error);
  });

  it("should fail with wrong email", () => {
    const wrongEmail = new User(dummyData.wrongEmail);
    expect(wrongEmail.save()).rejects.toBeInstanceOf(mongoose.Error);
  });

  it("should fail with short password", () => {
    const shortPassword = new User(dummyData.shortPassword);
    expect(shortPassword.save()).rejects.toBeInstanceOf(mongoose.Error);
  });

  it("should fail when try to save the same user", () => {
    const existingUser = new User(dummyData.user);
    expect(existingUser.save()).rejects.toBeInstanceOf(MongoError);
  });
});
