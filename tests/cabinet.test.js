const {
    ownerOf,
    cabinetFilter,
    belongsToCabinet,
  } = require("../utils/cabinet");
  
  describe("Cabinet ownership", () => {
    const doctorA = "507f1f77bcf86cd799439011";
    const doctorB = "507f191e810c19729de860ea";
  
    const req = {
      user: { id: doctorA },
    };
  
    test("should identify the authenticated doctor", () => {
      expect(ownerOf(req)).toBe(doctorA);
    });
  
    test("should filter data by doctorId", () => {
      expect(cabinetFilter(req)).toEqual({
        doctorId: doctorA,
      });
    });
  
    test("should allow access to own data", () => {
      expect(
        belongsToCabinet(req, { doctorId: doctorA })
      ).toBe(true);
    });
  
    test("should reject another doctor's data", () => {
      expect(
        belongsToCabinet(req, { doctorId: doctorB })
      ).toBe(false);
    });
  
    test("should reject data without an owner", () => {
      expect(
        belongsToCabinet(req, {})
      ).toBe(false);
    });
  });