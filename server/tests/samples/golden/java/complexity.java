// COMPLEXITY TESTS
class Complexity {
    // O(1)
    public int oOne(int[] arr) {
        return arr[0] + arr[1];
    }

    // O(log n)
    public int oLogN(int n) {
        int count = 0;
        while (n > 1) {
            n = n / 2;
            count++;
        }
        return count;
    }

    // O(n)
    public int oN(int[] arr) {
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }

    // O(n log n)
    public void oNLogN(int[] arr) {
        java.util.Arrays.sort(arr);
        for (int i = 0; i < arr.length; i++) {
            int left = 0;
            int right = arr.length - 1;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (arr[mid] == arr[i]) break;
                if (arr[mid] < arr[i]) left = mid + 1;
                else right = mid - 1;
            }
        }
    }

    // O(n^2)
    public int oNSquared(int[] arr) {
        int count = 0;
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length; j++) {
                if (arr[i] == arr[j]) count++;
            }
        }
        return count;
    }

    // O(n^3)
    public int oNCubed(int[] arr) {
        int count = 0;
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length; j++) {
                for (int k = 0; k < arr.length; k++) {
                    if (arr[i] + arr[j] + arr[k] == 0) count++;
                }
            }
        }
        return count;
    }

    // recursive complexity (O(n))
    public void recursiveON(int n) {
        if (n <= 0) return;
        recursiveON(n - 1);
    }

    // exponential recursion O(2^n)
    public int exponential(int n) {
        if (n <= 1) return n;
        return exponential(n - 1) + exponential(n - 2);
    }
}
