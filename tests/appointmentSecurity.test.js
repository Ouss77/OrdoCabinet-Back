const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const Admin = require("../models/AdminModel");
const Patient = require("../models/UserModel");
const Appointment = require("../models/Apointment.model");

describe("Appointment API Security", () => {
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

  test("should reject an appointment for another doctor's patient", async () => {
    const token = jwt.sign(
      { userId: doctorB },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );

    jest.spyOn(Admin, "findById").mockResolvedValue({
      _id: doctorB,
    });

    jest.spyOn(Patient, "findById").mockResolvedValue({
      _id: patientId,
      doctorId: doctorA,
    });

    const saveSpy = jest.spyOn(
      Appointment.prototype,
      "save"
    );

    const response = await request(app)
      .post("/appointments")
      .set("Cookie", `auth_token=${token}`)
      .send({
        date: "2026-11-15",
        time: "10:00",
        patientName: "Patient Test",
        patientId,
        comment: "Consultation",
      });

    expect(response.status).toBe(403);
    expect(saveSpy).not.toHaveBeenCalled();
  });
});