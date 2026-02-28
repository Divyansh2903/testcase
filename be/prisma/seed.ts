import "dotenv/config";
import type { PrismaClient } from "../src/generated/prisma/client.js";

// Judge0-style language IDs (commonly used)
const LANG = {
  JAVASCRIPT: 63,
  PYTHON: 71,
  CPP: 54,
  C: 50,
  TYPESCRIPT: 74,
} as const;

// Expected output format: no trailing newline; multi-line uses \n between lines only.
// This avoids Judge0 WA when user prints with/without trailing newline (app normalizes both).
const TC = {
  twoSum: [
    { input: "2 7 11 15\n9", expectedOutput: "0 1", visibility: true },
    { input: "3 2 4\n6", expectedOutput: "1 2", visibility: true },
    { input: "3 3\n6", expectedOutput: "0 1", visibility: false },
  ],
  reverseString: [
    { input: "hello", expectedOutput: "olleh", visibility: true },
    { input: "abcd", expectedOutput: "dcba", visibility: false },
  ],
  fizzBuzz: [
    { input: "3", expectedOutput: "1\n2\nFizz", visibility: true },
    { input: "5", expectedOutput: "1\n2\nFizz\n4\nBuzz", visibility: false },
  ],
  validAnagram: [
    { input: "anagram\nnagaram", expectedOutput: "true", visibility: true },
    { input: "rat\ncar", expectedOutput: "false", visibility: true },
    { input: "a\nab", expectedOutput: "false", visibility: false },
  ],
} as const;

export async function main(prisma: PrismaClient) {
  // Create tags (shared across problems)
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { title: "Arrays" }, update: {}, create: { title: "Arrays" } }),
    prisma.tag.upsert({ where: { title: "Strings" }, update: {}, create: { title: "Strings" } }),
    prisma.tag.upsert({ where: { title: "Math" }, update: {}, create: { title: "Math" } }),
    prisma.tag.upsert({ where: { title: "Hash Table" }, update: {}, create: { title: "Hash Table" } }),
    prisma.tag.upsert({ where: { title: "Two Pointers" }, update: {}, create: { title: "Two Pointers" } }),
    prisma.tag.upsert({ where: { title: "Sorting" }, update: {}, create: { title: "Sorting" } }),
  ]);

  // Problem 1: Two Sum
  await prisma.problem.upsert({
    where: { id: "seed-two-sum" },
    update: {
      testCases: {
        deleteMany: {},
        create: TC.twoSum.map((tc) => ({ ...tc })),
      },
      starterCodes: {
        deleteMany: {},
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function twoSum(nums, target) {
  // Your code here
  return [];
}
const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');
const nums = input[0].split(' ').map(Number);
const target = Number(input[1]);
console.log(twoSum(nums, target).join(' '));`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your code here
    return []

import sys
lines = sys.stdin.read().strip().split('\\n')
nums = list(map(int, lines[0].split()))
target = int(lines[1])
print(' '.join(map(str, two_sum(nums, target))))`,
          },
          {
            languageId: LANG.CPP,
            code: `#include <iostream>
#include <sstream>
#include <vector>
using namespace std;
vector<int> twoSum(vector<int>& nums, int target) {
  // Your code here
  return {};
}
int main() {
  string line; getline(cin, line);
  vector<int> nums;
  int x; istringstream iss(line);
  while (iss >> x) nums.push_back(x);
  int target; cin >> target;
  vector<int> ans = twoSum(nums, target);
  cout << ans[0] << " " << ans[1];
  return 0;
}`,
          },
        ],
      },
    },
    create: {
      id: "seed-two-sum",
      name: "Two Sum",
      description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      difficulty: "EASY",
      timeLimit: 2,
      memoryLimit: 256,
      published: true,
      tags: { connect: [{ id: tags[0].id }, { id: tags[3].id }] },
      examples: {
        create: [
          {
            input: "nums = [2, 7, 11, 15], target = 9",
            output: "[0, 1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
          },
          {
            input: "nums = [3, 2, 4], target = 6",
            output: "[1, 2]",
            explanation: "nums[1] + nums[2] == 6.",
          },
        ],
      },
      testCases: {
        create: TC.twoSum.map((tc) => ({ ...tc })),
      },
      starterCodes: {
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function twoSum(nums, target) {
  // Your code here
  return [];
}
const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');
const nums = input[0].split(' ').map(Number);
const target = Number(input[1]);
console.log(twoSum(nums, target).join(' '));`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your code here
    return []

import sys
lines = sys.stdin.read().strip().split('\\n')
nums = list(map(int, lines[0].split()))
target = int(lines[1])
print(' '.join(map(str, two_sum(nums, target))))`,
          },
          {
            languageId: LANG.CPP,
            code: `#include <iostream>
#include <sstream>
#include <vector>
using namespace std;
vector<int> twoSum(vector<int>& nums, int target) {
  // Your code here
  return {};
}
int main() {
  string line; getline(cin, line);
  vector<int> nums;
  int x; istringstream iss(line);
  while (iss >> x) nums.push_back(x);
  int target; cin >> target;
  vector<int> ans = twoSum(nums, target);
  cout << ans[0] << " " << ans[1];
  return 0;
}`,
          },
        ],
      },
    },
  });

  // Problem 2: Reverse String
  await prisma.problem.upsert({
    where: { id: "seed-reverse-string" },
    update: {
      testCases: {
        deleteMany: {},
        create: TC.reverseString.map((tc) => ({ ...tc })),
      },
      starterCodes: {
        deleteMany: {},
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function reverseString(s) {
  // Your code here (modify s in-place)
}
const input = require('fs').readFileSync(0, 'utf-8').trim();
const s = input.split('');
reverseString(s);
console.log(s.join(''));`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def reverse_string(s: list[str]) -> None:
    # Your code here (modify s in-place)
    pass

import sys
s = list(sys.stdin.read().strip())
reverse_string(s)
print(''.join(s))`,
          },
        ],
      },
    },
    create: {
      id: "seed-reverse-string",
      name: "Reverse String",
      description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.`,
      difficulty: "EASY",
      timeLimit: 2,
      memoryLimit: 256,
      published: true,
      tags: { connect: [{ id: tags[1].id }, { id: tags[4].id }] },
      examples: {
        create: [
          {
            input: 's = ["h","e","l","l","o"]',
            output: '["o","l","l","e","h"]',
            explanation: "Reverse in-place.",
          },
        ],
      },
      testCases: {
        create: TC.reverseString.map((tc) => ({ ...tc })),
      },
      starterCodes: {
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function reverseString(s) {
  // Your code here (modify s in-place)
}
const input = require('fs').readFileSync(0, 'utf-8').trim();
const s = input.split('');
reverseString(s);
console.log(s.join(''));`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def reverse_string(s: list[str]) -> None:
    # Your code here (modify s in-place)
    pass

import sys
s = list(sys.stdin.read().strip())
reverse_string(s)
print(''.join(s))`,
          },
        ],
      },
    },
  });

  // Problem 3: Fizz Buzz
  await prisma.problem.upsert({
    where: { id: "seed-fizz-buzz" },
    update: {
      testCases: {
        deleteMany: {},
        create: TC.fizzBuzz.map((tc) => ({ ...tc })),
      },
      starterCodes: {
        deleteMany: {},
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function fizzBuzz(n) {
  const answer = [];
  // Your code here
  return answer;
}
const n = parseInt(require('fs').readFileSync(0, 'utf-8').trim(), 10);
console.log(fizzBuzz(n).join('\\n'));`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def fizz_buzz(n: int) -> list[str]:
    # Your code here
    return []

import sys
n = int(sys.stdin.read().strip())
print('\\n'.join(fizz_buzz(n)))`,
          },
        ],
      },
    },
    create: {
      id: "seed-fizz-buzz",
      name: "Fizz Buzz",
      description: `Given an integer \`n\`, return a string array where:
- \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
- \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
- \`answer[i] == i\` (as a string) otherwise.

Return the array for indices 1 to n (1-indexed).`,
      difficulty: "EASY",
      timeLimit: 1,
      memoryLimit: 128,
      published: true,
      tags: { connect: [{ id: tags[2].id }] },
      examples: {
        create: [
          {
            input: "n = 15",
            output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
            explanation: "Numbers 3,6,9,12 are Fizz; 5,10 are Buzz; 15 is FizzBuzz.",
          },
        ],
      },
      testCases: {
        create: TC.fizzBuzz.map((tc) => ({ ...tc })),
      },
      starterCodes: {
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function fizzBuzz(n) {
  const answer = [];
  // Your code here
  return answer;
}
const n = parseInt(require('fs').readFileSync(0, 'utf-8').trim(), 10);
console.log(fizzBuzz(n).join('\\n'));`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def fizz_buzz(n: int) -> list[str]:
    # Your code here
    return []

import sys
n = int(sys.stdin.read().strip())
print('\\n'.join(fizz_buzz(n)))`,
          },
        ],
      },
    },
  });

  // Problem 4: Valid Anagram (Medium)
  await prisma.problem.upsert({
    where: { id: "seed-valid-anagram" },
    update: {
      testCases: {
        deleteMany: {},
        create: TC.validAnagram.map((tc) => ({ ...tc })),
      },
      starterCodes: {
        deleteMany: {},
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function isAnagram(s, t) {
  // Your code here
  return false;
}
const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');
const s = input[0], t = input[1];
console.log(isAnagram(s, t));`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def is_anagram(s: str, t: str) -> bool:
    # Your code here
    return False

import sys
lines = sys.stdin.read().strip().split('\\n')
s, t = lines[0], lines[1]
print(str(is_anagram(s, t)).lower())`,
          },
        ],
      },
    },
    create: {
      id: "seed-valid-anagram",
      name: "Valid Anagram",
      description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
      difficulty: "MEDIUM",
      timeLimit: 2,
      memoryLimit: 256,
      published: true,
      tags: { connect: [{ id: tags[1].id }, { id: tags[3].id }, { id: tags[5].id }] },
      examples: {
        create: [
          {
            input: 's = "anagram", t = "nagaram"',
            output: "true",
            explanation: "Both strings contain the same characters with same frequencies.",
          },
          {
            input: 's = "rat", t = "car"',
            output: "false",
            explanation: "Different character sets.",
          },
        ],
      },
      testCases: {
        create: TC.validAnagram.map((tc) => ({ ...tc })),
      },
      starterCodes: {
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function isAnagram(s, t) {
  // Your code here
  return false;
}
const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');
const s = input[0], t = input[1];
console.log(isAnagram(s, t));`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def is_anagram(s: str, t: str) -> bool:
    # Your code here
    return False

import sys
lines = sys.stdin.read().strip().split('\\n')
s, t = lines[0], lines[1]
print(str(is_anagram(s, t)).lower())`,
          },
        ],
      },
    },
  });

  console.log("Seed completed: problems, tags, examples, test cases, and starter codes created.");
}
