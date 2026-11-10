const jwt = require("jsonwebtoken");
const requireAuth = require("../middleware/requireAuth");
const Admin = require("../models/AdminModel");

describe("requireAuth Middleware", () => {
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

  const mockRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  });

  test("should reject a request without a token", () => {
    const req = { cookies: {} };
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("should reject an invalid token", () => {
    const req = {
      cookies: { auth_token: "invalid-token" },
    };
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("should accept a valid token", async () => {
    const doctorId = "507f1f77bcf86cd799439011";
  
    const token = jwt.sign(
      { userId: doctorId },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );
  
    jest.spyOn(Admin, "findById").mockResolvedValue({
      _id: doctorId,
    });
  
    const req = {
      cookies: { auth_token: token },
    };
  
    const res = mockRes();
    const next = jest.fn();
  
    await requireAuth(req, res, next);
  
    expect(Admin.findById).toHaveBeenCalledWith(doctorId);
  
    expect(req.user).toEqual({
      id: doctorId,
    });
  
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("should reject an expired token", () => {
    const token = jwt.sign(
      { userId: "doctor123" },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: -1 }
    );

    const req = {
      cookies: { auth_token: token },
    };
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("should reject a token without userId", () => {
    const token = jwt.sign(
      { role: "doctor" },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    const req = {
      cookies: { auth_token: token },
    };
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});