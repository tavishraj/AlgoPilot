# COMPLEXITY TESTS
# O(1)
def o_one(arr):
    return arr[0] + arr[1]

# O(log n)
def o_log_n(n):
    count = 0
    while n > 1:
        n = n // 2
        count += 1
    return count

# O(n)
def o_n(arr):
    s = 0
    for i in range(len(arr)):
        s += arr[i]
    return s

# O(n log n)
def o_n_log_n(arr):
    arr.sort()
    for i in range(len(arr)):
        left = 0
        right = len(arr) - 1
        while left <= right:
            mid = (left + right) // 2
            if arr[mid] == arr[i]:
                break
            if arr[mid] < arr[i]:
                left = mid + 1
            else:
                right = mid - 1

# O(n^2)
def o_n_squared(arr):
    count = 0
    for i in range(len(arr)):
        for j in range(len(arr)):
            if arr[i] == arr[j]:
                count += 1
    return count

# O(n^3)
def o_n_cubed(arr):
    count = 0
    for i in range(len(arr)):
        for j in range(len(arr)):
            for k in range(len(arr)):
                if arr[i] + arr[j] + arr[k] == 0:
                    count += 1
    return count

# recursive complexity (O(n))
def recursive_o_n(n):
    if n <= 0:
        return
    recursive_o_n(n - 1)

# exponential recursion O(2^n)
def exponential(n):
    if n <= 1:
        return n
    return exponential(n - 1) + exponential(n - 2)
