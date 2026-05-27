// MISTAKE TESTS
#include <iostream>
#include <vector>

using namespace std;

// off-by-one errors
void offByOne(vector<int>& arr) {
    for (int i = 0; i <= arr.size(); i++) {
        cout << arr[i] << endl;
    }
}

// missing return
int missingReturn(int a, int b) {
    int sum = a + b;
    // Should return sum
}

// unused variables
int unusedVars() {
    int x = 10;
    int y = 20;
    return y;
}

// wrong comparisons
bool wrongComparison(bool a, bool b) {
    if (a = b) {
        return true;
    }
    return false;
}

// unreachable code
int unreachable() {
    return 1;
    int x = 2; // Unreachable
}

// edge-case omissions
int edgeCaseOmission(vector<int>& arr) {
    int maxVal = arr[0];
    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] > maxVal) maxVal = arr[i];
    }
    return maxVal;
}
