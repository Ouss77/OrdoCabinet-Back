const { register } = require("../controllers/admin.controller");
const Admin = require("../models/AdminModel");
const bcrypt = require("bcryptjs");

const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

const validBody = (overrides = {}) => ({
  username: "test",
  password: "password",
  fullName: "Test Doctor",
  cabinetName: "Test Cabinet",
  email: "test@example.com",
  ...overrides,
});

const stubCreate = (hashedPassword = "hashed-password") => {
  jest.spyOn(Admin, "findOne").mockResolvedValue(null);
  jest.spyOn(bcrypt, "hash").mockResolvedValue(hashedPassword);
  jest.spyOn(Admin.prototype, "save").mockImplementation(async function save() {
    return this;
  });
};

describe("Register Controller", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should register a new admin and store a hash", async () => {
    const req = { body: validBody() };
    const res = mockRes();
    stubCreate();

    await register(req, res);

    expect(Admin.findOne).toHaveBeenCalledWith({ username: "test" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
    const saved = Admin.prototype.save.mock.instances[0];
    expect(saved.password).toBe("hashed-password");
    expect(saved.password).not.toBe("password");
    expect(saved.specialty).toBe("");
    expect(saved.phone).toBe("");
    expect(saved.city).toBe("");
    expect(saved.address).toBe("");
    expect(saved.plan).toBe("Cabinet");

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Compte créé",
        username: "test",
        fullName: "Test Doctor",
        cabinetName: "Test Cabinet",
        email: "test@example.com",
        specialty: "",
        phone: "",
        city: "",
        address: "",
        plan: "Cabinet",
      })
    );
    expect(res.json.mock.calls[0][0]).not.toHaveProperty("password");
  });

  test("should persist optional profile fields", async () => {
    const req = {
      body: validBody({
        specialty: "Cardiologie",
        phone: "0600000000",
        city: "Tunis",
        address: "1 rue de la Paix",
        plan: "Clinique",
      }),
    };
    const res = mockRes();
    stubCreate();

    await register(req, res);

    const saved = Admin.prototype.save.mock.instances[0];
    expect(saved.specialty).toBe("Cardiologie");
    expect(saved.phone).toBe("0600000000");
    expect(saved.city).toBe("Tunis");
    expect(saved.address).toBe("1 rue de la Paix");
    expect(saved.plan).toBe("Clinique");
    expect(saved.email).toBe("test@example.com");

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        specialty: "Cardiologie",
        phone: "0600000000",
        city: "Tunis",
        address: "1 rue de la Paix",
        plan: "Clinique",
        email: "test@example.com",
      })
    );
  });

  test("should accept a password of exactly 6 characters", async () => {
    const req = { body: validBody({ password: "123456" }) };
    const res = mockRes();
    stubCreate("hashed-six");

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(Admin.prototype.save.mock.instances[0].password).toBe("hashed-six");
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("should reject duplicate username", async () => {
    const req = { body: validBody() };
    const res = mockRes();

    jest.spyOn(Admin, "findOne").mockResolvedValue({ username: "test" });
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const saveSpy = jest.spyOn(Admin.prototype, "save");

    await register(req, res);

    expect(Admin.findOne).toHaveBeenCalledWith({ username: "test" });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cet identifiant est déjà utilisé.",
    });
    expect(hashSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  test.each([
    ["a missing username", { username: undefined }],
    ["a missing password", { password: undefined }],
    ["a missing fullName", { fullName: undefined }],
    ["a missing cabinetName", { cabinetName: undefined }],
    ["an empty username", { username: "" }],
    ["an empty password", { password: "" }],
    ["an empty fullName", { fullName: "" }],
    ["an empty cabinetName", { cabinetName: "" }],
  ])("should reject registration with %s", async (_label, overrides) => {
    const req = { body: validBody(overrides) };
    const res = mockRes();
    const findOneSpy = jest.spyOn(Admin, "findOne");
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const saveSpy = jest.spyOn(Admin.prototype, "save");

    await register(req, res);

    expect(findOneSpy).not.toHaveBeenCalled();
    expect(hashSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Nom, cabinet, identifiant et mot de passe sont requis.",
    });
  });

  test("should reject short password", async () => {
    const req = { body: validBody({ password: "12345" }) };
    const res = mockRes();
    const findOneSpy = jest.spyOn(Admin, "findOne");
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const saveSpy = jest.spyOn(Admin.prototype, "save");

    await register(req, res);

    expect(findOneSpy).not.toHaveBeenCalled();
    expect(hashSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Le mot de passe doit contenir au moins 6 caractères.",
    });
  });

  test("should return 500 when the lookup fails", async () => {
    const req = { body: validBody() };
    const res = mockRes();
    jest.spyOn(Admin, "findOne").mockRejectedValue(new Error("Database failed"));
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const saveSpy = jest.spyOn(Admin.prototype, "save");

    await register(req, res);

    expect(hashSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "Database failed",
    });
  });

  test("should return 500 when hashing fails", async () => {
    const req = { body: validBody() };
    const res = mockRes();
    jest.spyOn(Admin, "findOne").mockResolvedValue(null);
    jest.spyOn(bcrypt, "hash").mockRejectedValue(new Error("hash failed"));
    const saveSpy = jest.spyOn(Admin.prototype, "save");

    await register(req, res);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "hash failed",
    });
  });

  test("should return 500 when save fails", async () => {
    const req = { body: validBody() };
    const res = mockRes();
    jest.spyOn(Admin, "findOne").mockResolvedValue(null);
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed-password");
    jest.spyOn(Admin.prototype, "save").mockRejectedValue(new Error("save failed"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "save failed",
    });
  });
});
