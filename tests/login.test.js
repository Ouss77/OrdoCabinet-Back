const { login } = require("../controllers/admin.controller");
const Admin = require("../models/AdminModel");
const bcrypt = require("bcryptjs"); // À adapter à l'import réel du contrôleur

describe("Login Controller", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should reject unknown username", async () => {
    // ARRANGE
    const req = {
      body: {
        username: "unknown",
        password: "123456"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // TODO 1 : Simuler Admin.findOne()
    jest.spyOn(Admin, "findOne").mockResolvedValue(null);

    // TODO 2 : Surveiller bcrypt.compare()
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
    // ACT
    // TODO 3 : Appeler login(req, res)
    await login(req, res);

    // ASSERT
    // TODO 4 : Vérifier HTTP 401
    expect(res.status).toHaveBeenCalledWith(401);

    // TODO 5 : Vérifier le message exact
    expect(res.json).toHaveBeenCalledWith({message: "Authentication failed. User not found." });

    // TODO 6 : Vérifier que bcrypt.compare()
    expect(bcrypt.compare).not.toHaveBeenCalled();
    // n'a jamais été appelée
  });

  test("should reject incorrect password", async () => {
    // ARRANGE
    const req = {
      body: {
        username: "admin",
        password: "123456"
      }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };

    jest.spyOn(Admin, "findOne").mockResolvedValue({
        _id: "123",
        username: "admin",
        password: "hashedPassword"
      });
      
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({message: "Authentication failed. Wrong password." });
  });

});