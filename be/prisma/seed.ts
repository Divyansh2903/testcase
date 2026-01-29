import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { prisma } from "../src/lib/prisma.js";


// Judge0-style language IDs (commonly used)
const LANG = {
  JAVASCRIPT: 63,
  PYTHON: 71,
  CPP: 54,
  C: 50,
  TYPESCRIPT: 74,
} as const;

async function main() {
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
    update: {},
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
        create: [
          { input: "2 7 11 15\n9", expectedOutput: "0 1", visibility: true },
          { input: "3 2 4\n6", expectedOutput: "1 2", visibility: true },
          { input: "3 3\n6", expectedOutput: "0 1", visibility: false },
        ],
      },
      starterCodes: {
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function twoSum(nums, target) {
  // Your code here
  return [];
}`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your code here
    return []`,
          },
          {
            languageId: LANG.CPP,
            code: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    return {};
}`,
          },
        ],
      },
    },
  });

  // Problem 2: Reverse String
  await prisma.problem.upsert({
    where: { id: "seed-reverse-string" },
    update: {},
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
        create: [
          { input: "hello", expectedOutput: "olleh", visibility: true },
          { input: "abcd", expectedOutput: "dcba", visibility: false },
        ],
      },
      starterCodes: {
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function reverseString(s) {
  // Your code here
}`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def reverse_string(s: list[str]) -> None:
    # Your code here (modify s in-place)
    pass`,
          },
        ],
      },
    },
  });

  // Problem 3: Fizz Buzz
  await prisma.problem.upsert({
    where: { id: "seed-fizz-buzz" },
    update: {},
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
        create: [
          { input: "3", expectedOutput: "1 2 Fizz", visibility: true },
          { input: "5", expectedOutput: "1 2 Fizz 4 Buzz", visibility: false },
        ],
      },
      starterCodes: {
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function fizzBuzz(n) {
  const answer = [];
  // Your code here
  return answer;
}`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def fizz_buzz(n: int) -> list[str]:
    # Your code here
    return []`,
          },
        ],
      },
    },
  });

  // Problem 4: Valid Anagram (Medium)
  await prisma.problem.upsert({
    where: { id: "seed-valid-anagram" },
    update: {},
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
        create: [
          { input: "anagram\nnagaram", expectedOutput: "true", visibility: true },
          { input: "rat\ncar", expectedOutput: "false", visibility: true },
          { input: "a\nab", expectedOutput: "false", visibility: false },
        ],
      },
      starterCodes: {
        create: [
          {
            languageId: LANG.JAVASCRIPT,
            code: `function isAnagram(s, t) {
  // Your code here
  return false;
}`,
          },
          {
            languageId: LANG.PYTHON,
            code: `def is_anagram(s: str, t: str) -> bool:
    # Your code here
    return False`,
          },
        ],
      },
    },
  });

  console.log("Seed completed: problems, tags, examples, test cases, and starter codes created.");
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
