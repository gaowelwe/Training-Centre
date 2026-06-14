const Course = require("./models/Course");

const fee = 1200;
const discount = 10;

const discountedFee = fee - (fee * discount / 100);

console.log("Expected:", 1080);
console.log("Actual:", discountedFee);

if (discountedFee === 1080) {
    console.log("PASS");
} else {
    console.log("FAIL");
}