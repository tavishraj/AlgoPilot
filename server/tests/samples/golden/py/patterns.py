# PATTERN TESTS
# binary search
def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# two pointers
def two_sum(numbers, target):
    l = 0
    r = len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target:
            return [l + 1, r + 1]
        elif s < target:
            l += 1
        else:
            r -= 1
    return [-1, -1]

# sliding window
def max_subarray_len(nums, k):
    sum_val = 0
    max_len = 0
    map_val = {}
    for i in range(len(nums)):
        sum_val += nums[i]
        if sum_val == k:
            max_len = i + 1
        elif (sum_val - k) in map_val:
            max_len = max(max_len, i - map_val[sum_val - k])
        if sum_val not in map_val:
            map_val[sum_val] = i
    return max_len

# DFS
def dfs(node, visited):
    if not node:
        return
    visited.add(node.val)
    for child in node.children:
        if child.val not in visited:
            dfs(child, visited)

# BFS
def bfs(root):
    if not root:
        return []
    queue = [root]
    res = []
    while len(queue) > 0:
        node = queue.pop(0)
        res.append(node.val)
        for child in node.children:
            queue.append(child)
    return res

# dynamic programming
def fib(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

# recursion
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# prefix sum
def prefix_sum(nums):
    prefix = [0] * (len(nums) + 1)
    for i in range(len(nums)):
        prefix[i + 1] = prefix[i] + nums[i]
    return prefix

# greedy
def max_profit(prices):
    min_price = float('inf')
    max_p = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > max_p:
            max_p = p - min_price
    return max_p

# hashmap frequency
def top_k_frequent(nums, k):
    freq_map = {}
    for num in nums:
        freq_map[num] = freq_map.get(num, 0) + 1
    return []

# monotonic stack
def daily_temperatures(T):
    stack = []
    res = [0] * len(T)
    for i in range(len(T)):
        while len(stack) > 0 and T[i] > T[stack[-1]]:
            idx = stack.pop()
            res[idx] = i - idx
        stack.append(i)
    return res

# sorting-based solution
def find_kth_largest(nums, k):
    nums.sort(reverse=True)
    return nums[k - 1]
