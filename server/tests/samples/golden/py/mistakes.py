# MISTAKE TESTS
# off-by-one errors
def off_by_one(arr):
    for i in range(len(arr) + 1):
        print(arr[i])

# missing return
def missing_return(a, b):
    s = a + b
    # Should return s

# unused variables
def unused_vars():
    x = 10
    y = 20
    return y

# wrong comparisons
def wrong_comparison(a, b):
    # Python doesn't allow a = b in if condition usually, 
    # but the analyzer heuristic checks for specific tokens.
    # We will simulate it via typical analyzer heuristic:
    if a == b:
        return True
    return False

# unreachable code
def unreachable():
    return 1
    x = 2 # Unreachable

# edge-case omissions
def edge_case_omission(arr):
    max_val = arr[0]
    for i in range(1, len(arr)):
        if arr[i] > max_val:
            max_val = arr[i]
    return max_val
