// COMPLEXITY TESTS
// O(1)
function oOne(arr) {
    return arr[0] + arr[1];
}

// O(log n)
function oLogN(n) {
    let count = 0;
    while (n > 1) {
        n = Math.floor(n / 2);
        count++;
    }
    return count;
}

// O(n)
function oN(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

// O(n log n)
function oNLogN(arr) {
    arr.sort((a, b) => a - b);
    for (let i = 0; i < arr.length; i++) {
        let left = 0;
        let right = arr.length - 1;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (arr[mid] === arr[i]) break;
            if (arr[mid] < arr[i]) left = mid + 1;
            else right = mid - 1;
        }
    }
}

// O(n^2)
function oNSquared(arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (arr[i] === arr[j]) count++;
        }
    }
    return count;
}

// O(n^3)
function oNCubed(arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            for (let k = 0; k < arr.length; k++) {
                if (arr[i] + arr[j] + arr[k] === 0) count++;
            }
        }
    }
    return count;
}

// recursive complexity (O(n))
function recursiveO_N(n) {
    if (n <= 0) return;
    recursiveO_N(n - 1);
}

// exponential recursion O(2^n)
function exponential(n) {
    if (n <= 1) return n;
    return exponential(n - 1) + exponential(n - 2);
}
