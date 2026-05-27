// PATTERN TESTS
#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <stack>
#include <algorithm>

using namespace std;

// binary search
int binarySearch(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// two pointers
vector<int> twoSum(vector<int>& numbers, int target) {
    int l = 0;
    int r = numbers.size() - 1;
    while (l < r) {
        int sum = numbers[l] + numbers[r];
        if (sum == target) return {l + 1, r + 1};
        else if (sum < target) l++;
        else r--;
    }
    return {-1, -1};
}

// sliding window
int maxSubArrayLen(vector<int>& nums, int k) {
    int sum = 0, maxLen = 0;
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        sum += nums[i];
        if (sum == k) maxLen = i + 1;
        else if (map.count(sum - k)) maxLen = max(maxLen, i - map[sum - k]);
        if (!map.count(sum)) map[sum] = i;
    }
    return maxLen;
}

struct TreeNode {
    int val;
    vector<TreeNode*> children;
};

// DFS
void dfs(TreeNode* node, unordered_set<int>& visited) {
    if (!node) return;
    visited.insert(node->val);
    for (auto child : node->children) {
        if (!visited.count(child->val)) {
            dfs(child, visited);
        }
    }
}

// BFS
vector<int> bfs(TreeNode* root) {
    if (!root) return {};
    queue<TreeNode*> q;
    q.push(root);
    vector<int> res;
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        res.push_back(node->val);
        for (auto child : node->children) {
            q.push(child);
        }
    }
    return res;
}

// dynamic programming
int fib(int n) {
    if (n <= 1) return n;
    vector<int> dp(n + 1, 0);
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

// recursion
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// prefix sum
vector<int> prefixSum(vector<int>& nums) {
    vector<int> prefix(nums.size() + 1, 0);
    for (int i = 0; i < nums.size(); i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    return prefix;
}

// greedy
int maxProfit(vector<int>& prices) {
    int minPrice = 1e9;
    int maxP = 0;
    for (int p : prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxP) maxP = p - minPrice;
    }
    return maxP;
}

// hashmap frequency
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> map;
    for (int num : nums) {
        map[num]++;
    }
    return {};
}

// monotonic stack
vector<int> dailyTemperatures(vector<int>& T) {
    stack<int> st;
    vector<int> res(T.size(), 0);
    for (int i = 0; i < T.size(); i++) {
        while (!st.empty() && T[i] > T[st.top()]) {
            int idx = st.top();
            st.pop();
            res[idx] = i - idx;
        }
        st.push(i);
    }
    return res;
}

// sorting-based solution
int findKthLargest(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end(), greater<int>());
    return nums[k - 1];
}
