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
});