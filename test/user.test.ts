import mongoose from "mongoose";
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

  it("should fail with blank fields", async () => {
    const blankUser = new User(dummyData.blankUser);
    try {
      await blankUser.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  it("should fail with blank email", async () => {
    const blankEmail = new User(dummyData.blankEmail);
    try {
      await blankEmail.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  it("should fail with blank password", async () => {
    const blankPassword = new User(dummyData.blankPassword);
    try {
      await blankPassword.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  it("should fail with wrong email", async () => {
    const wrongEmail = new User(dummyData.wrongEmail);
    try {
      await wrongEmail.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  it("should fail with short password", async () => {
    const shortPassword = new User(dummyData.shortPassword);
    try {
      await shortPassword.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  it("should fail when try to save the same user", async () => {
    const existingUser = new User(dummyData.user);
    try {
      await existingUser.save();
    } catch (error) {
      expect(error).toBeInstanceOf(MongoError);
    }
  });
});
