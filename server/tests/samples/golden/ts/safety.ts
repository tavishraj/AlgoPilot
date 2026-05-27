// SAFETY TESTS
// infinite loops
function infiniteLoop() {
    let count = 0;
    while (count < 10) {
        console.log(count);
        // Forgot to increment count
    }
}

// recursion without base case
function noBaseCase(n) {
    return n * noBaseCase(n - 1);
}

// unsafe indexing
function unsafeIndexing(arr) {
    for (let i = 0; i <= arr.length + 1; i++) {
        console.log(arr[i]);
    }
}

// mutation during iteration
function mutateDuringIter(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) {
            arr.splice(i, 1);
        }
    }
}

// deeply nested loops
function deeplyNested(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            for (let k = 0; k < arr.length; k++) {
                for (let l = 0; l < arr.length; l++) {
                    console.log(i, j, k, l);
                }
            }
        }
    }
}
