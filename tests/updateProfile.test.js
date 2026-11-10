const Admin = require("../models/AdminModel");
const { updateProfile } = require("../controllers/admin.controller");

describe("Update Profile Controller", () => {
  const doctorId = "507f1f77bcf86cd799439011";

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  });

  test("should update only the authenticated doctor's profile", async () => {
    const req = {
      user: { id: doctorId },
      body: {
        fullName: "Dr Ahmed",
        cabinetName: "Cabinet Ahmed",
        username: "another-doctor",
        plan: "Premium",
      },
    };

    const res = mockRes();

    const updatedUser = {
      _id: doctorId,
      username: "ahmed",
      password: "hashed-password",
      fullName: "Dr Ahmed",
      cabinetName: "Cabinet Ahmed",
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

    jest
      .spyOn(Admin, "findByIdAndUpdate")
      .mockResolvedValue(updatedUser);

    await updateProfile(req, res);

    expect(Admin.findByIdAndUpdate).toHaveBeenCalledWith(
      doctorId,
      {
        $set: {
          fullName: "Dr Ahmed",
          cabinetName: "Cabinet Ahmed",
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json.mock.calls[0][0]).not.toHaveProperty(
      "password"
    );
  });

  test("should return 404 when the account does not exist", async () => {
    const req = {
      user: { id: doctorId },
      body: { fullName: "Dr Ahmed" },
    };

    const res = mockRes();

    jest
      .spyOn(Admin, "findByIdAndUpdate")
      .mockResolvedValue(null);

    await updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});