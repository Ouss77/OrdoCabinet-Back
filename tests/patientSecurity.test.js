const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");
const Patient = require("../models/UserModel");

describe("Patient API Security", () => {
  test("should reject unauthenticated access", async () => {
    const response = await request(app)
      .get("/api/users");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Authentification requise.",
    });
  });

  test("should list only authenticated doctor's patients", async () => {
    const doctorId = "507f1f77bcf86cd799439011";

    const token = jwt.sign({ userId: doctorId }, process.env.JWT_SECRET, { expiresIn: "1h" });

    jest.spyOn(Admin, "findById").mockResolvedValue({
        _id: doctorId,
    });

    const findSpy = jest.spyOn(Patient, "find").mockResolvedValue([])

    const response = await request(app)
      .get("/api/users")
      .set("Cookie", `auth_token=${token}`);

    expect(response.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({ doctorId: doctorId });    

});

test("should reject access to another doctor's patient", async () => {
    const doctorA = "507f1f77bcf86cd799439011";
    const doctorB = "507f191e810c19729de860ea";
    const patientId = "507f1f77bcf86cd799439022";
  
    const token = jwt.sign(
      { userId: doctorB },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );
  
    // Le médecin B existe et possède un JWT valide
    jest.spyOn(Admin, "findById").mockResolvedValue({
      _id: doctorB,
    });
  
    // Mais le patient appartient au médecin A
    jest.spyOn(Patient, "findById").mockResolvedValue({
      _id: patientId,
      doctorId: doctorA,
      medicalInfos: [
        { diagnostic: "Test médical" },
      ],
    });
  
    const response = await request(app)
      .get(`/api/users/medicalInfo/${patientId}`)
      .set("Cookie", `auth_token=${token}`);
  
    expect(response.status).toBe(403);
  
    expect(response.body).toEqual({
      message: "Ce dossier appartient à un autre cabinet.",
    });
  });
});