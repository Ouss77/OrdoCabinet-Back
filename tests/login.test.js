const { login } = require("../controllers/admin.controller");
const Admin = require("../models/AdminModel");
const bcrypt = require("bcryptjs");

const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

const existingUser = (overrides = {}) => ({
  _id: "123",
  username: "admin",
  password: "hashedPassword",
  fullName: "Admin Test",
  cabinetName: "Cabinet Test",
  toObject() {
    return {
      _id: this._id,
      username: this.username,
      password: this.password,
      fullName: this.fullName,
      cabinetName: this.cabinetName,
    };
  },
  ...overrides,
});

describe("Login Controller", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each([
    ["a missing username", { password: "123456" }],
    ["a missing password", { username: "admin" }],
    ["empty credentials", { username: "", password: "" }],
  ])("should reject login with %s", async (_label, body) => {
    const req = { body };
    const res = mockRes();
    const findOneSpy = jest.spyOn(Admin, "findOne");
    const compareSpy = jest.spyOn(bcrypt, "compare");

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username and password are required.",
    });
    expect(findOneSpy).not.toHaveBeenCalled();
    expect(compareSpy).not.toHaveBeenCalled();
  });

  test("should reject unknown username", async () => {
    const req = {
      body: {
        username: "unknown",
        password: "123456",
      },
    };
    const res = mockRes();

    jest.spyOn(Admin, "findOne").mockResolvedValue(null);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    await login(req, res);

    expect(Admin.findOne).toHaveBeenCalledWith({ username: "unknown" });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication failed. User not found.",
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test("should reject incorrect password", async () => {
    const req = {
      body: {
        username: "admin",
        password: "123456",
      },
    };
    const res = mockRes();

    jest.spyOn(Admin, "findOne").mockResolvedValue(existingUser());
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    await login(req, res);

    expect(Admin.findOne).toHaveBeenCalledWith({ username: "admin" });
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashedPassword");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication failed. Wrong password.",
    });
  });

  test("should login successfully", async () => {
    const req = {
      body: {
        username: "admin",
        password: "123456",
      },
    };
    const res = mockRes();

    jest.spyOn(Admin, "findOne").mockResolvedValue(existingUser());
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    await login(req, res);

    expect(Admin.findOne).toHaveBeenCalledWith({ username: "admin" });
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashedPassword");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      _id: "123",
      username: "admin",
      fullName: "Admin Test",
      cabinetName: "Cabinet Test",
    });
  });

  test("should return 500 when the database fails", async () => {
    const req = {
      body: {
        username: "admin",
        password: "123456",
      },
    };
    const res = mockRes();
    jest.spyOn(Admin, "findOne").mockRejectedValue(new Error("Database error"));
    const compareSpy = jest.spyOn(bcrypt, "compare");

    await login(req, res);

    expect(compareSpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "Database error",
    });
  });

  test("should return 500 when password comparison fails", async () => {
    const req = {
      body: {
        username: "admin",
        password: "123456",
      },
    };
    const res = mockRes();
    jest.spyOn(Admin, "findOne").mockResolvedValue(existingUser());
    jest.spyOn(bcrypt, "compare").mockRejectedValue(new Error("compare failed"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "compare failed",
    });
  });
});
