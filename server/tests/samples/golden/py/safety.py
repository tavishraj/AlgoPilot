# SAFETY TESTS
# infinite loops
def infinite_loop():
    count = 0
    while count < 10:
        print(count)
        # Forgot to increment count

# recursion without base case
def no_base_case(n):
    return n * no_base_case(n - 1)

# unsafe indexing
def unsafe_indexing(arr):
    for i in range(len(arr) + 2):
        print(arr[i])

# mutation during iteration
def mutate_during_iter(arr):
    for i in range(len(arr)):
        if arr[i] == 0:
            arr.pop(i)

# deeply nested loops
def deeply_nested(arr):
    for i in range(len(arr)):
        for j in range(len(arr)):
            for k in range(len(arr)):
                for l in range(len(arr)):
                    print(i, j, k, l)
