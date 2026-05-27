// SAFETY TESTS
import java.util.*;

class Safety {
    // infinite loops
    public void infiniteLoop() {
        int count = 0;
        while (count < 10) {
            System.out.println(count);
            // Forgot to increment count
        }
    }

    // recursion without base case
    public int noBaseCase(int n) {
        return n * noBaseCase(n - 1);
    }

    // unsafe indexing
    public void unsafeIndexing(int[] arr) {
        for (int i = 0; i <= arr.length + 1; i++) {
            System.out.println(arr[i]);
        }
    }

    // mutation during iteration
    public void mutateDuringIter(List<Integer> list) {
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i) == 0) {
                list.remove(i);
            }
        }
    }

    // deeply nested loops
    public void deeplyNested(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length; j++) {
                for (int k = 0; k < arr.length; k++) {
                    for (int l = 0; l < arr.length; l++) {
                        System.out.println(i + j + k + l);
                    }
                }
            }
        }
    }
}
