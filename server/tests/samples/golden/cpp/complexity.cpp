// COMPLEXITY TESTS
#include <vector>
#include <algorithm>

using namespace std;

// O(1)
int oOne(vector<int>& arr) {
    return arr[0] + arr[1];
}

// O(log n)
int oLogN(int n) {
    int count = 0;
    while (n > 1) {
        n = n / 2;
        count++;
    }
    return count;
}

// O(n)
int oN(vector<int>& arr) {
    int sum = 0;
    for (int i = 0; i < arr.size(); i++) {
        sum += arr[i];
    }
    return sum;
}

// O(n log n)
void oNLogN(vector<int>& arr) {
    sort(arr.begin(), arr.end());
    for (int i = 0; i < arr.size(); i++) {
        int left = 0;
        int right = arr.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == arr[i]) break;
            if (arr[mid] < arr[i]) left = mid + 1;
            else right = mid - 1;
        }
    }
}

// O(n^2)
int oNSquared(vector<int>& arr) {
    int count = 0;
    for (int i = 0; i < arr.size(); i++) {
        for (int j = 0; j < arr.size(); j++) {
            if (arr[i] == arr[j]) count++;
        }
    }
    return count;
}

// O(n^3)
int oNCubed(vector<int>& arr) {
    int count = 0;
    for (int i = 0; i < arr.size(); i++) {
        for (int j = 0; j < arr.size(); j++) {
            for (int k = 0; k < arr.size(); k++) {
                if (arr[i] + arr[j] + arr[k] == 0) count++;
            }
        }
    }
    return count;
}

// recursive complexity (O(n))
void recursiveON(int n) {
    if (n <= 0) return;
    recursiveON(n - 1);
}

// exponential recursion O(2^n)
int exponential(int n) {
    if (n <= 1) return n;
    return exponential(n - 1) + exponential(n - 2);
}
