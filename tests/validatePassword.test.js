const { validatePassword } = require("../utils/validatePassword");

describe("validate password", () => {

    test("validate length of password taller than 6", () => {
        const result = validatePassword("123456");

        expect(result).toBe(true);
    })

    test ("validate length of password taller than 3 than 6", () => {
        const result = validatePassword("02");

        expect(result).toBe(false);
    })

    test("validate password different than empty", () => {
        const result = validatePassword("");

        expect(result).toBe(false);
    })

    test("should reject null password", () =>{
        const result = validatePassword(null);

        expect(result).toBe(false);
    })
})