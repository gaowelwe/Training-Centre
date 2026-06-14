const Course = require("../models/Course");

test("calculates discounted fee correctly", () => {

    const result = Course.calculateDiscount(1200, 10);

    expect(result).toBe(1080);

});