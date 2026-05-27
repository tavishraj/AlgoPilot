// MISTAKE TESTS
// off-by-one errors
function offByOne(arr) {
    for (let i = 0; i <= arr.length; i++) {
        console.log(arr[i]);
    }
}

// missing return
function missingReturn(a, b) {
    let sum = a + b;
    // Should return sum
}

// unused variables
function unusedVars() {
    let x = 10;
    let y = 20;
    return y;
}

// wrong comparisons
function wrongComparison(a, b) {
    if (a = b) {
        return true;
    }
    return false;
}

// unreachable code
function unreachable() {
    return 1;
    let x = 2; // Unreachable
}

// edge-case omissions
function edgeCaseOmission(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}
