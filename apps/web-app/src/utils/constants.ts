export const LANGUAGE_VERSIONS: Record<string, string> = {
    python: "3.10.0",
    java: "15.0.2",
    "cpp": "10.2.0",
    javascript: "18.15.0",
    typescript: "5.0.3",
    csharp: "6.12.0",
    c: "10.0.0",
    ruby: "3.0.1",
    go: "1.16.2",
    php: "8.2.3",
    swift: "5.3.3",
    rust: "1.68.2",
    kotlin: "1.8.20"
};

export type Language =
    | "javascript"
    | "typescript"
    | "python"
    | "java"
    | "cpp"
    | "csharp"
    | "ruby"
    | "go"
    | "php"
    | "swift"
    | "rust"
    | "kotlin"
    | "c";

export const STARTER_CODE: Record<string, string> = {
    javascript: "console.log('Hello Coders!');",
    typescript: "console.log('Hello Coders!');",
    python: "print('Hello Coders!')",
    java: `public class Main { 
    public static void main(String[] args) { 
        System.out.println("Hello Coders!"); 
    } 
}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() \n{ \n\tcout << "Hello Coders!" << endl; \n\treturn 0; \n}`,
    csharp: `using System;\nclass Program { \n\tstatic void Main() { \n\t\tConsole.WriteLine("Hello Coders!"); \n\t} \n}`,
    ruby: "puts 'Hello Coders!'",
    go: `package main\nimport "fmt"\nfunc main() { \n\tfmt.Println("Hello Coders!") \n}`,
    php: `<?php \necho 'Hello Coders!'; \n?>`,
    swift: `import Foundation\nprint("Hello Coders!")`,
    kotlin: `fun main() {\n\tprintln("Hello Coders!")\n}`,
    c: `#include <stdio.h>\n\nint main() {\n\tprintf("Hello Coders!\\n");\n\treturn 0;\n}`,
    rust: `fn main() {\n\tprintln!("Hello Coders!");\n}`,
};

export const question = {
    name: `GCD-sequence`,
    description: `
GCD (Greatest Common Divisor) of two integers x and y is the maximum integer z by which both x and y are divisible. For example, GCD(36,48)=12, GCD(5,10)=5, and GCD(7,11)=1.

Kristina has an array a consisting of exactly n positive integers. She wants to count the GCD of each neighbouring pair of numbers to get a new array b, called GCD-sequence.

So, the elements of the GCD-sequence b will be calculated using the formula bi=GCD(ai,ai+1) for 1≤i≤n−1.

Determine whether it is possible to remove exactly one number from the array a so that the GCD sequence b is non-decreasing (i.e., bi≤bi+1 is always true).

For example, let Khristina had an array a = [20,6,12,3,48,36]. If she removes a4=3 from it and counts the GCD-sequence of b, she gets:
b1=GCD(20,6)=2
b2=GCD(6,12)=6
b3=GCD(12,48)=12
b4=GCD(48,36)=12
The resulting GCD sequence b = [2,6,12,12] is non-decreasing because b1≤b2≤b3≤b4.

Input
The first line of input data contains a single number t (1≤t≤104) — he number of test cases in the test.

This is followed by the descriptions of the test cases.

The first line of each test case contains a single integer n (3≤n≤2⋅105) — the number of elements in the array a.

The second line of each test case contains exactly n integers ai (1≤ai≤109) — the elements of array a.

It is guaranteed that the sum of n over all test case does not exceed 2⋅105.

Output
For each test case, output a single line:

"YES" if you can remove exactly one number from the array a so that the GCD-sequence of b is non-decreasing;
"NO" otherwise.
You can output the answer in any case (for example, the strings "yEs", "yes", "Yes", and "YES" will all be recognized as a positive answer).
    `,
};