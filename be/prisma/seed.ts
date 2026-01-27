import "dotenv/config";
import { prisma } from "../src/lib/prisma.js";

const TAG_TITLES = [
  "Array",
  "String",
  "Hash Table",
  "Two Pointers",
  "Dynamic Programming",
  "Linked List",
  "Stack",
  "Math",
  "Sorting",
] as const;

function tag(title: (typeof TAG_TITLES)[number]) {
  return tagByTitle[title]!.id;
}

let tagByTitle: Record<(typeof TAG_TITLES)[number], { id: number }> = {} as never;

async function main() {
  console.log("Starting seed...\n");

  // Create tags
  console.log("Creating tags:", TAG_TITLES.join(", "));
  const tagRecords = await Promise.all(
    TAG_TITLES.map((title) =>
      prisma.tag.upsert({
        where: { title },
        create: { title },
        update: {},
      })
    )
  );
  tagByTitle = Object.fromEntries(
    TAG_TITLES.map((t, i) => [t, { id: tagRecords[i]!.id }])
  ) as typeof tagByTitle;
  console.log(`Created ${tagRecords.length} tags.\n`);

  // Problem 1: Two Sum
  console.log("Upserting problem: Two Sum (EASY)...");
  await prisma.problem.upsert({
    where: { id: "two-sum" },
    create: {
      id: "two-sum",
      name: "Two Sum",
      description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: "nums = [2, 7, 11, 15], target = 9",
            output: "[0, 1]",
            explaination:
              "Because nums[0] + nums[1] == 9, we return [0, 1].",
          },
          {
            input: "nums = [3, 2, 4], target = 6",
            output: "[1, 2]",
            explaination: "Because nums[1] + nums[2] == 6, we return [1, 2].",
          },
        ],
      },
      test_cases: {
        create: [
          {
            input: "[2, 7, 11, 15]\\n9",
            expected_output: "[0, 1]",
            visibility: false,
          },
          {
            input: "[3, 2, 4]\\n6",
            expected_output: "[1, 2]",
            visibility: true,
          },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function twoSum(nums, target) {\n  // Your code here\n  return [];\n}",
          },
          {
            language: "PYTHON",
            code: "def two_sum(nums: list[int], target: int) -> list[int]:\n    # Your code here\n    return []",
          },
          {
            language: "CPP",
            code: "vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}",
          },
        ],
      },
      tags: {
        connect: [
          { id: tag("Array") },
          { id: tag("String") },
          { id: tag("Hash Table") },
        ],
      },
    },
    update: {},
  });
  console.log("  -> 2 examples, 2 test cases, 3 starter code, 3 tags\n");

  // Problem 2: Valid Parentheses
  console.log("Upserting problem: Valid Parentheses (EASY)...");
  await prisma.problem.upsert({
    where: { id: "valid-parentheses" },
    create: {
      id: "valid-parentheses",
      name: "Valid Parentheses",
      description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: "s = \"()\"",
            output: "true",
            explaination: "The brackets are correctly matched.",
          },
          {
            input: "s = \"()[]{}\"",
            output: "true",
            explaination: "All types of brackets are correctly matched.",
          },
          {
            input: "s = \"(]\"",
            output: "false",
            explaination: "Closing bracket does not match the opening bracket.",
          },
        ],
      },
      test_cases: {
        create: [
          {
            input: '"()"',
            expected_output: "true",
            visibility: true,
          },
          {
            input: '"([)]"',
            expected_output: "false",
            visibility: false,
          },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function isValid(s) {\n  // Your code here\n  return false;\n}",
          },
          {
            language: "PYTHON",
            code: "def is_valid(s: str) -> bool:\n    # Your code here\n    return False",
          },
        ],
      },
      tags: {
        connect: [{ id: tag("String") }, { id: tag("Two Pointers") }],
      },
    },
    update: {},
  });
  console.log("  -> 3 examples, 2 test cases, 2 starter code, 2 tags\n");

  // Problem 3: Maximum Subarray (Kadane's)
  console.log("Upserting problem: Maximum Subarray (MEDIUM)...");
  await prisma.problem.upsert({
    where: { id: "maximum-subarray" },
    create: {
      id: "maximum-subarray",
      name: "Maximum Subarray",
      description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous part of an array.`,
      difficulty: "MEDIUM",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
            output: "6",
            explaination:
              "The subarray [4, -1, 2, 1] has the largest sum 6.",
          },
          {
            input: "nums = [1]",
            output: "1",
            explaination: "The subarray [1] has the largest sum 1.",
          },
        ],
      },
      test_cases: {
        create: [
          {
            input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
            expected_output: "6",
            visibility: false,
          },
          {
            input: "[5, 4, -1, 7, 8]",
            expected_output: "23",
            visibility: true,
          },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function maxSubArray(nums) {\n  // Your code here\n  return 0;\n}",
          },
          {
            language: "PYTHON",
            code: "def max_sub_array(nums: list[int]) -> int:\n    # Your code here\n    return 0",
          },
        ],
      },
      tags: {
        connect: [{ id: tag("Array") }, { id: tag("Dynamic Programming") }],
      },
    },
    update: {},
  });
  console.log("  -> 2 examples, 2 test cases, 2 starter code, 2 tags\n");

  // Problem 4: Reverse String
  console.log("Upserting problem: Reverse String (EASY)...");
  await prisma.problem.upsert({
    where: { id: "reverse-string" },
    create: {
      id: "reverse-string",
      name: "Reverse String",
      description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: 's = ["h","e","l","l","o"]',
            output: '["o","l","l","e","h"]',
            explaination: "Reverse of hello is olleh.",
          },
        ],
      },
      test_cases: {
        create: [
          {
            input: '["h","e","l","l","o"]',
            expected_output: '["o","l","l","e","h"]',
            visibility: true,
          },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function reverseString(s) {\n  // Your code here - modify s in-place\n}",
          },
          {
            language: "PYTHON",
            code: "def reverse_string(s: list[str]) -> None:\n    # Your code here - modify s in-place\n    pass",
          },
        ],
      },
      tags: {
        connect: [
          { id: tag("Array") },
          { id: tag("String") },
          { id: tag("Two Pointers") },
        ],
      },
    },
    update: {},
  });
  console.log("  -> 1 example, 1 test case, 2 starter code, 3 tags\n");

  // Problem 5: Palindrome Number
  console.log("Upserting problem: Palindrome Number (EASY)...");
  await prisma.problem.upsert({
    where: { id: "palindrome-number" },
    create: {
      id: "palindrome-number",
      name: "Palindrome Number",
      description: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.

A number is a palindrome when it reads the same forward and backward. For example, 121 is a palindrome while 123 is not.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: "x = 121",
            output: "true",
            explaination: "121 reads as 121 from left to right and from right to left.",
          },
          {
            input: "x = -121",
            output: "false",
            explaination: "From left to right it reads -121. From right to left it becomes 121-. So it is not a palindrome.",
          },
        ],
      },
      test_cases: {
        create: [
          { input: "121", expected_output: "true", visibility: true },
          { input: "-121", expected_output: "false", visibility: true },
          { input: "10", expected_output: "false", visibility: false },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function isPalindrome(x) {\n  // Your code here\n  return false;\n}",
          },
          {
            language: "PYTHON",
            code: "def is_palindrome(x: int) -> bool:\n    # Your code here\n    return False",
          },
        ],
      },
      tags: { connect: [{ id: tag("Math") }, { id: tag("String") }] },
    },
    update: {},
  });
  console.log("  -> 2 examples, 3 test cases, 2 starter code, 2 tags\n");

  // Problem 6: Contains Duplicate
  console.log("Upserting problem: Contains Duplicate (EASY)...");
  await prisma.problem.upsert({
    where: { id: "contains-duplicate" },
    create: {
      id: "contains-duplicate",
      name: "Contains Duplicate",
      description: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: "nums = [1, 2, 3, 1]",
            output: "true",
            explaination: "1 appears twice.",
          },
          {
            input: "nums = [1, 2, 3, 4]",
            output: "false",
            explaination: "All elements are distinct.",
          },
        ],
      },
      test_cases: {
        create: [
          { input: "[1,2,3,1]", expected_output: "true", visibility: true },
          { input: "[1,2,3,4]", expected_output: "false", visibility: true },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function containsDuplicate(nums) {\n  // Your code here\n  return false;\n}",
          },
          {
            language: "PYTHON",
            code: "def contains_duplicate(nums: list[int]) -> bool:\n    # Your code here\n    return False",
          },
        ],
      },
      tags: {
        connect: [
          { id: tag("Array") },
          { id: tag("Hash Table") },
          { id: tag("Sorting") },
        ],
      },
    },
    update: {},
  });
  console.log("  -> 2 examples, 2 test cases, 2 starter code, 3 tags\n");

  // Problem 7: Best Time to Buy and Sell Stock
  console.log("Upserting problem: Best Time to Buy and Sell Stock (EASY)...");
  await prisma.problem.upsert({
    where: { id: "best-time-buy-sell-stock" },
    create: {
      id: "best-time-buy-sell-stock",
      name: "Best Time to Buy and Sell Stock",
      description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: "prices = [7, 1, 5, 3, 6, 4]",
            output: "5",
            explaination: "Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5.",
          },
          {
            input: "prices = [7, 6, 4, 3, 1]",
            output: "0",
            explaination: "No transactions are done and the max profit = 0.",
          },
        ],
      },
      test_cases: {
        create: [
          {
            input: "[7,1,5,3,6,4]",
            expected_output: "5",
            visibility: true,
          },
          {
            input: "[7,6,4,3,1]",
            expected_output: "0",
            visibility: false,
          },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function maxProfit(prices) {\n  // Your code here\n  return 0;\n}",
          },
          {
            language: "PYTHON",
            code: "def max_profit(prices: list[int]) -> int:\n    # Your code here\n    return 0",
          },
        ],
      },
      tags: {
        connect: [
          { id: tag("Array") },
          { id: tag("Dynamic Programming") },
        ],
      },
    },
    update: {},
  });
  console.log("  -> 2 examples, 2 test cases, 2 starter code, 2 tags\n");

  // Problem 8: Fizz Buzz
  console.log("Upserting problem: Fizz Buzz (EASY)...");
  await prisma.problem.upsert({
    where: { id: "fizz-buzz" },
    create: {
      id: "fizz-buzz",
      name: "Fizz Buzz",
      description: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:
- \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
- \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
- \`answer[i] == i\` (as a string) if none of the above conditions are true.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: "n = 3",
            output: '["1","2","Fizz"]',
            explaination: "For n=3, output is 1, 2, Fizz.",
          },
          {
            input: "n = 15",
            output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
            explaination: "For n=15, output follows the rules.",
          },
        ],
      },
      test_cases: {
        create: [
          { input: "3", expected_output: '["1","2","Fizz"]', visibility: true },
          { input: "5", expected_output: '["1","2","Fizz","4","Buzz"]', visibility: false },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function fizzBuzz(n) {\n  // Your code here\n  return [];\n}",
          },
          {
            language: "PYTHON",
            code: "def fizz_buzz(n: int) -> list[str]:\n    # Your code here\n    return []",
          },
        ],
      },
      tags: { connect: [{ id: tag("Math") }] },
    },
    update: {},
  });
  console.log("  -> 2 examples, 2 test cases, 2 starter code, 1 tag\n");

  // Problem 9: Climbing Stairs
  console.log("Upserting problem: Climbing Stairs (EASY)...");
  await prisma.problem.upsert({
    where: { id: "climbing-stairs" },
    create: {
      id: "climbing-stairs",
      name: "Climbing Stairs",
      description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: "n = 2",
            output: "2",
            explaination: "There are two ways to climb to the top: 1 step + 1 step, or 2 steps.",
          },
          {
            input: "n = 3",
            output: "3",
            explaination: "There are three ways: 1+1+1, 1+2, or 2+1.",
          },
        ],
      },
      test_cases: {
        create: [
          { input: "2", expected_output: "2", visibility: true },
          { input: "3", expected_output: "3", visibility: true },
          { input: "5", expected_output: "8", visibility: false },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function climbStairs(n) {\n  // Your code here\n  return 0;\n}",
          },
          {
            language: "PYTHON",
            code: "def climb_stairs(n: int) -> int:\n    # Your code here\n    return 0",
          },
        ],
      },
      tags: { connect: [{ id: tag("Dynamic Programming") }, { id: tag("Math") }] },
    },
    update: {},
  });
  console.log("  -> 2 examples, 3 test cases, 2 starter code, 2 tags\n");

  // Problem 10: Remove Duplicates from Sorted Array
  console.log("Upserting problem: Remove Duplicates from Sorted Array (EASY)...");
  await prisma.problem.upsert({
    where: { id: "remove-duplicates-sorted-array" },
    create: {
      id: "remove-duplicates-sorted-array",
      name: "Remove Duplicates from Sorted Array",
      description: `Given an integer array \`nums\` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.

Return \`k\`, the number of unique elements.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: "nums = [1, 1, 2]",
            output: "2",
            explaination: "Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.",
          },
          {
            input: "nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]",
            output: "5",
            explaination: "Your function should return k = 5, with the first five elements being 0, 1, 2, 3, and 4.",
          },
        ],
      },
      test_cases: {
        create: [
          { input: "[1,1,2]", expected_output: "2", visibility: true },
          { input: "[0,0,1,1,1,2,2,3,3,4]", expected_output: "5", visibility: false },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function removeDuplicates(nums) {\n  // Your code here - modify nums in-place\n  return 0;\n}",
          },
          {
            language: "PYTHON",
            code: "def remove_duplicates(nums: list[int]) -> int:\n    # Your code here - modify nums in-place\n    return 0",
          },
        ],
      },
      tags: { connect: [{ id: tag("Array") }, { id: tag("Two Pointers") }] },
    },
    update: {},
  });
  console.log("  -> 2 examples, 2 test cases, 2 starter code, 2 tags\n");

  // Problem 11: Single Number
  console.log("Upserting problem: Single Number (EASY)...");
  await prisma.problem.upsert({
    where: { id: "single-number" },
    create: {
      id: "single-number",
      name: "Single Number",
      description: `Given a non-empty array of integers \`nums\`, every element appears twice except for one. Find that single one.

You must implement a solution with linear runtime complexity and use only constant extra space.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: "nums = [2, 2, 1]",
            output: "1",
            explaination: "Only 1 appears once.",
          },
          {
            input: "nums = [4, 1, 2, 1, 2]",
            output: "4",
            explaination: "Only 4 appears once.",
          },
        ],
      },
      test_cases: {
        create: [
          { input: "[2,2,1]", expected_output: "1", visibility: true },
          { input: "[4,1,2,1,2]", expected_output: "4", visibility: false },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function singleNumber(nums) {\n  // Your code here\n  return 0;\n}",
          },
          {
            language: "PYTHON",
            code: "def single_number(nums: list[int]) -> int:\n    # Your code here\n    return 0",
          },
        ],
      },
      tags: { connect: [{ id: tag("Array") }, { id: tag("Hash Table") }] },
    },
    update: {},
  });
  console.log("  -> 2 examples, 2 test cases, 2 starter code, 2 tags\n");

  // Problem 12: Roman to Integer
  console.log("Upserting problem: Roman to Integer (EASY)...");
  await prisma.problem.upsert({
    where: { id: "roman-to-integer" },
    create: {
      id: "roman-to-integer",
      name: "Roman to Integer",
      description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

Given a roman numeral, convert it to an integer.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: 's = "III"',
            output: "3",
            explaination: "III = 3.",
          },
          {
            input: 's = "LVIII"',
            output: "58",
            explaination: "L = 50, V = 5, III = 3.",
          },
          {
            input: 's = "MCMXCIV"',
            output: "1994",
            explaination: "M = 1000, CM = 900, XC = 90, IV = 4.",
          },
        ],
      },
      test_cases: {
        create: [
          { input: '"III"', expected_output: "3", visibility: true },
          { input: '"MCMXCIV"', expected_output: "1994", visibility: false },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function romanToInt(s) {\n  // Your code here\n  return 0;\n}",
          },
          {
            language: "PYTHON",
            code: "def roman_to_int(s: str) -> int:\n    # Your code here\n    return 0",
          },
        ],
      },
      tags: { connect: [{ id: tag("String") }, { id: tag("Math") }] },
    },
    update: {},
  });
  console.log("  -> 3 examples, 2 test cases, 2 starter code, 2 tags\n");

  // Problem 13: Longest Common Prefix
  console.log("Upserting problem: Longest Common Prefix (EASY)...");
  await prisma.problem.upsert({
    where: { id: "longest-common-prefix" },
    create: {
      id: "longest-common-prefix",
      name: "Longest Common Prefix",
      description: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string \`""\`.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: 'strs = ["flower","flow","flight"]',
            output: '"fl"',
            explaination: "The longest common prefix is \"fl\".",
          },
          {
            input: 'strs = ["dog","racecar","car"]',
            output: '""',
            explaination: "There is no common prefix among the input strings.",
          },
        ],
      },
      test_cases: {
        create: [
          { input: '["flower","flow","flight"]', expected_output: '"fl"', visibility: true },
          { input: '["a"]', expected_output: '"a"', visibility: false },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function longestCommonPrefix(strs) {\n  // Your code here\n  return \"\";\n}",
          },
          {
            language: "PYTHON",
            code: "def longest_common_prefix(strs: list[str]) -> str:\n    # Your code here\n    return \"\"",
          },
        ],
      },
      tags: { connect: [{ id: tag("String") }] },
    },
    update: {},
  });
  console.log("  -> 2 examples, 2 test cases, 2 starter code, 1 tag\n");

  // Problem 14: Merge Sorted Array
  console.log("Upserting problem: Merge Sorted Array (EASY)...");
  await prisma.problem.upsert({
    where: { id: "merge-sorted-array" },
    create: {
      id: "merge-sorted-array",
      name: "Merge Sorted Array",
      description: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in non-decreasing order, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

Merge \`nums1\` and \`nums2\` into a single array sorted in non-decreasing order. The final sorted array should not be returned by the function, but instead be stored inside the array \`nums1\`.`,
      difficulty: "EASY",
      time_limit: 5000,
      memory_limit: 256,
      published: true,
      examples: {
        create: [
          {
            input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
            output: "[1,2,2,3,5,6]",
            explaination: "The arrays we are merging are [1,2,3] and [2,5,6]. The result is [1,2,2,3,5,6].",
          },
          {
            input: "nums1 = [1], m = 1, nums2 = [], n = 0",
            output: "[1]",
            explaination: "nums1 already contains the merged result.",
          },
        ],
      },
      test_cases: {
        create: [
          {
            input: "[1,2,3,0,0,0]\\n3\\n[2,5,6]\\n3",
            expected_output: "[1,2,2,3,5,6]",
            visibility: true,
          },
          {
            input: "[1]\\n1\\n[]\\n0",
            expected_output: "[1]",
            visibility: false,
          },
        ],
      },
      starter_code: {
        create: [
          {
            language: "JAVASCRIPT",
            code: "function merge(nums1, m, nums2, n) {\n  // Your code here - modify nums1 in-place\n}",
          },
          {
            language: "PYTHON",
            code: "def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:\n    # Your code here - modify nums1 in-place\n    pass",
          },
        ],
      },
      tags: {
        connect: [
          { id: tag("Array") },
          { id: tag("Two Pointers") },
          { id: tag("Sorting") },
        ],
      },
    },
    update: {},
  });
  console.log("  -> 2 examples, 2 test cases, 2 starter code, 3 tags\n");

  console.log("Seed completed. 14 problems created/updated.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
