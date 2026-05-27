// SAFETY TESTS
#include <iostream>
#include <vector>

using namespace std;

// infinite loops
void infiniteLoop() {
    int count = 0;
    while (count < 10) {
        cout << count << endl;
        // Forgot to increment count
    }
}

// recursion without base case
int noBaseCase(int n) {
    return n * noBaseCase(n - 1);
}

// unsafe indexing
void unsafeIndexing(vector<int>& arr) {
    for (int i = 0; i <= arr.size() + 1; i++) {
        cout << arr[i] << endl;
    }
}

// mutation during iteration
void mutateDuringIter(vector<int>& list) {
    for (int i = 0; i < list.size(); i++) {
        if (list[i] == 0) {
            list.erase(list.begin() + i);
        }
    }
}

// deeply nested loops
void deeplyNested(vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        for (int j = 0; j < arr.size(); j++) {
            for (int k = 0; k < arr.size(); k++) {
                for (int l = 0; l < arr.size(); l++) {
                    cout << i + j + k + l << endl;
                }
            }
        }
    }
}
