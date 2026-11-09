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

  test("should login successfully", async () => {
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
  
    const mockUser = {
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
    };
  
    // TODO 1 : Simuler Admin.findOne()
    jest.spyOn(Admin, "findOne").mockResolvedValue(mockUser);
  
    // TODO 2 : Simuler bcrypt.compare()
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
  
    // ACT
    // TODO 3 : Appeler login(req, res)
    await login(req, res);
    // ASSERT
    // TODO 4 : Vérifier HTTP 200
    expect(res.status).toHaveBeenCalledWith(200);
  
    // TODO 5 : Vérifier que la réponse contient :
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Login successful",
          username: "admin"
        })
      );  
    // TODO 6 : Vérifier que la réponse
    const responseBody = res.json.mock.calls[0][0];
    expect(responseBody).not.toHaveProperty("password"); 
 });

    test("should return 500 when the database fails", async () => {
        const req = {
          body: {
            username: "admin",
            password: "123456",
          },
        };
      
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        jest.spyOn(Admin, "findOne").mockRejectedValue(new Error("Database error"));
      
        await login(req, res);
      
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Internal server error",
          })
        );
      });

});