const {register} = require("../controllers/admin.controller")
const Admin = require("../models/AdminModel");

describe("Register Controller", () => {

    afterEach(async () => {
        jest.restoreAllMocks();
    });

    test("should register a new admin", async () => {
        const req = {
            body: {
              username: "test",
              email: "test@example.com",
              password: "password",
              fullName: "Test Doctor",
              cabinetName: "Test Cabinet"
            }
          };
          
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        }

        //username disponible
        jest.spyOn(Admin, "findOne").mockResolvedValue(null);
        //enregistrement simulé
        jest.spyOn(Admin.prototype, "save").mockImplementation(async function(){return this});

        //act 
        await register(req, res);
        console.log("STATUS:", res.status.mock.calls);
        console.log("RESPONSE:", res.json.mock.calls);

        // Assert
        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            message: "Compte créé",
            username: "test",
            fullName: "Test Doctor",
            cabinetName: "Test Cabinet"
        })
        );

        expect(res.json.mock.calls[0][0]).not.toHaveProperty("password");
        

    });

    test("should reject duplicate username", async () => {
        // Arrange
        const req = {
          body: {
            username: "test",
            fullName: "Test Doctor",
            password: "password",   
            cabinetName: "Test Cabinet"
          }
        };
      
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis()
        };
      
        jest.spyOn(Admin, "findOne").mockResolvedValue({
          username: "test"
        });
      
        const saveSpy = jest.spyOn(Admin.prototype, "save");
      
        // Act
        await register(req, res);
      
        // Assert
        expect(res.status).toHaveBeenCalledWith(409);
      
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Cet identifiant est déjà utilisé."
          })
        );
      
        expect(saveSpy).not.toHaveBeenCalled();
      });

    test("should reject registration with missing fullName", async () => {
        const req = {
            body: {
                username: "test",
                email: "test@example.com",
                password: "password",
                cabinetName: "Test Cabinet"
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        }


        const findOneSpy = jest.spyOn(Admin, "findOne")
        .mockResolvedValue(null);

        await register(req, res);

        expect(findOneSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({message: "Nom, cabinet, identifiant et mot de passe sont requis."})
        );
    })

    test("should reject short password", async () => {
        const req = {
            body: {
                username: "test",
                fullName: "Test Doctor",
                password: "12345",
                cabinetName: "Test Cabinet"
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        }
        const findOneSpy = jest.spyOn(Admin, "findOne")
        .mockResolvedValue(null);

        const saveSpy = jest.spyOn(Admin.prototype, "save");


        await register(req, res);

        expect(findOneSpy).not.toHaveBeenCalled();
        expect(saveSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({message: "Le mot de passe doit contenir au moins 6 caractères."})
        );
    })

    test("should return 500 when database fails", async() => {
        const req = {
            body: {
                username: "test",
                fullName: "Test Doctor",
                password: "password",
                cabinetName: "Test Cabinet"
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        }
        const findOneSpy = jest.spyOn(Admin, "findOne")
        .mockRejectedValue(new Error("Database failed"));

        await register(req, res);
        expect(findOneSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({    message: "Internal server error"
            })
        );
    })

});