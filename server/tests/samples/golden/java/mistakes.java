// MISTAKE TESTS
class Mistakes {
    // off-by-one errors
    public void offByOne(int[] arr) {
        for (int i = 0; i <= arr.length; i++) {
            System.out.println(arr[i]);
        }
    }

    // missing return
    public int missingReturn(int a, int b) {
        int sum = a + b;
        // Should return sum
    }

    // unused variables
    public int unusedVars() {
        int x = 10;
        int y = 20;
        return y;
    }

    // wrong comparisons
    public boolean wrongComparison(boolean a, boolean b) {
        if (a = b) {
            return true;
        }
        return false;
    }

    // unreachable code
    public int unreachable() {
        return 1;
        int x = 2; // Unreachable
    }

    // edge-case omissions
    public int edgeCaseOmission(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
        }
        return max;
    }
}
