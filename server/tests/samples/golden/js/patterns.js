// PATTERN TESTS
// binary search
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// two pointers
function twoSum(numbers, target) {
    let l = 0;
    let r = numbers.length - 1;
    while (l < r) {
        let sum = numbers[l] + numbers[r];
        if (sum === target) return [l + 1, r + 1];
        else if (sum < target) l++;
        else r--;
    }
    return [-1, -1];
}

// sliding window
function maxSubArrayLen(nums, k) {
    let sum = 0, maxLen = 0;
    let map = new Map();
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
        if (sum === k) maxLen = i + 1;
        else if (map.has(sum - k)) maxLen = Math.max(maxLen, i - map.get(sum - k));
        if (!map.has(sum)) map.set(sum, i);
    }
    return maxLen;
}

// DFS
function dfs(node, visited) {
    if (!node) return;
    visited.add(node.val);
    for (let child of node.children) {
        if (!visited.has(child.val)) {
            dfs(child, visited);
        }
    }
}

// BFS
function bfs(root) {
    if (!root) return [];
    let queue = [root];
    let res = [];
    while (queue.length > 0) {
        let node = queue.shift();
        res.push(node.val);
        for (let child of node.children) {
            queue.push(child);
        }
    }
    return res;
}

// dynamic programming
function fib(n) {
    if (n <= 1) return n;
    let dp = new Array(n + 1).fill(0);
    dp[1] = 1;
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

// recursion
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// prefix sum
function prefixSum(nums) {
    let prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    return prefix;
}

// greedy
function maxProfit(prices) {
    let minPrice = Infinity;
    let maxP = 0;
    for (let p of prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxP) maxP = p - minPrice;
    }
    return maxP;
}

// hashmap frequency
function topKFrequent(nums, k) {
    let map = new Map();
    for (let num of nums) {
        map.set(num, (map.get(num) || 0) + 1);
    }
    return [];
}

// monotonic stack
function dailyTemperatures(T) {
    let stack = [];
    let res = new Array(T.length).fill(0);
    for (let i = 0; i < T.length; i++) {
        while (stack.length > 0 && T[i] > T[stack[stack.length - 1]]) {
            let idx = stack.pop();
            res[idx] = i - idx;
        }
        stack.push(i);
    }
    return res;
}

// sorting-based solution
function findKthLargest(nums, k) {
    nums.sort((a, b) => b - a);
    return nums[k - 1];
}
