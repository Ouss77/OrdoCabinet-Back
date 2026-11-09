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
        //assert
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
});