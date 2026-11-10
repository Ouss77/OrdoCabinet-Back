const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const Admin = require("../models/AdminModel");
const Patient = require("../models/UserModel");
const Visit = require("../models/VisitModel");

describe("Visit API Security", () => {
  const doctorA = "507f1f77bcf86cd799439011";
  const doctorB = "507f191e810c19729de860ea";
  const patientId = "507f1f77bcf86cd799439022";

  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-for-jest-only";
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should reject creating a visit for another doctor's patient", async () => {
    const token = jwt.sign(
      { userId: doctorB },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );

    // Le médecin B est authentifié
    jest.spyOn(Admin, "findById").mockResolvedValue({
      _id: doctorB,
    });

    // Le patient appartient au médecin A
    jest.spyOn(Patient, "findById").mockResolvedValue({
      _id: patientId,
      doctorId: doctorA,
    });

    const saveSpy = jest.spyOn(Visit.prototype, "save");

    const response = await request(app)
      .post("/api/addVisit")
      .set("Cookie", `auth_token=${token}`)
      .send({
        nom: "Test",
        prenom: "Patient",
        motif: "Consultation",
        patientId,
      });
      console.log("STATUS:", response.status);
      console.log("BODY:", response.body);
    expect(response.status).toBe(403);
    expect(saveSpy).not.toHaveBeenCalled();
  });
});