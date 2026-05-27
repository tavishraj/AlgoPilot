// PATTERN TESTS
import java.util.*;

class Solution {
    // binary search
    public int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    // two pointers
    public int[] twoSum(int[] numbers, int target) {
        int l = 0;
        int r = numbers.length - 1;
        while (l < r) {
            int sum = numbers[l] + numbers[r];
            if (sum == target) return new int[]{l + 1, r + 1};
            else if (sum < target) l++;
            else r--;
        }
        return new int[]{-1, -1};
    }

    // sliding window
    public int maxSubArrayLen(int[] nums, int k) {
        int sum = 0, maxLen = 0;
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
            if (sum == k) maxLen = i + 1;
            else if (map.containsKey(sum - k)) maxLen = Math.max(maxLen, i - map.get(sum - k));
            if (!map.containsKey(sum)) map.put(sum, i);
        }
        return maxLen;
    }

    class TreeNode { int val; List<TreeNode> children; }

    // DFS
    public void dfs(TreeNode node, Set<Integer> visited) {
        if (node == null) return;
        visited.add(node.val);
        for (TreeNode child : node.children) {
            if (!visited.contains(child.val)) {
                dfs(child, visited);
            }
        }
    }

    // BFS
    public List<Integer> bfs(TreeNode root) {
        if (root == null) return new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        List<Integer> res = new ArrayList<>();
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            res.add(node.val);
            for (TreeNode child : node.children) {
                queue.add(child);
            }
        }
        return res;
    }

    // dynamic programming
    public int fib(int n) {
        if (n <= 1) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }

    // recursion
    public int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    // prefix sum
    public int[] prefixSum(int[] nums) {
        int[] prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        return prefix;
    }

    // greedy
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxP = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else if (p - minPrice > maxP) maxP = p - minPrice;
        }
        return maxP;
    }

    // hashmap frequency
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int num : nums) {
            map.put(num, map.getOrDefault(num, 0) + 1);
        }
        return new int[0];
    }

    // monotonic stack
    public int[] dailyTemperatures(int[] T) {
        Stack<Integer> stack = new Stack<>();
        int[] res = new int[T.length];
        for (int i = 0; i < T.length; i++) {
            while (!stack.isEmpty() && T[i] > T[stack.peek()]) {
                int idx = stack.pop();
                res[idx] = i - idx;
            }
            stack.push(i);
        }
        return res;
    }

    // sorting-based solution
    public int findKthLargest(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
    }
}
