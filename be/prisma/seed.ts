import "dotenv/config";
import { prisma } from "../src/lib/prisma.js";
import { Difficulty } from "../src/generated/prisma/enums.js";




// Helper function to convert difficulty string to enum
function getDifficulty(difficulty: string): Difficulty {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return Difficulty.EASY;
    case "medium":
      return Difficulty.MEDIUM;
    case "hard":
      return Difficulty.HARD;
    default:
      return Difficulty.EASY;
  }
}

// Helper function to get or create tags
async function getOrCreateTags(tagNames: string[]) {
  const tags = [];
  for (const tagName of tagNames) {
    const tag = await prisma.tags.upsert({
      where: { title: tagName },
      update: {},
      create: { title: tagName },
    });
    tags.push(tag);
  }
  return tags;
}

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🧹 Cleaning existing data...");
  await prisma.submissions.deleteMany();
  await prisma.problems.deleteMany();
  await prisma.tags.deleteMany();

  // Seed problems from the provided data
  const problemsData = [
    {
      id: "1",
      title: "Two Sum",
      slug: "two-sum",
      difficulty: "easy",
      tags: ["Array", "Hash Table"],
      memoryLimit: 256, // MB
      timeLimitSeconds: 2,
    },
    {
      id: "2",
      title: "Add Two Numbers",
      slug: "add-two-numbers",
      difficulty: "medium",
      tags: ["Linked List", "Math", "Recursion"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "3",
      title: "Longest Substring Without Repeating Characters",
      slug: "longest-substring-without-repeating-characters",
      difficulty: "medium",
      tags: ["Hash Table", "String", "Sliding Window"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "4",
      title: "Median of Two Sorted Arrays",
      slug: "median-of-two-sorted-arrays",
      difficulty: "hard",
      tags: ["Array", "Binary Search", "Divide and Conquer"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "5",
      title: "Valid Parentheses",
      slug: "valid-parentheses",
      difficulty: "easy",
      tags: ["String", "Stack"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
    {
      id: "6",
      title: "Merge K Sorted Lists",
      slug: "merge-k-sorted-lists",
      difficulty: "hard",
      tags: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"],
      memoryLimit: 512,
      timeLimitSeconds: 2,
    },
    // Additional problems
    {
      id: "7",
      title: "Reverse Linked List",
      slug: "reverse-linked-list",
      difficulty: "easy",
      tags: ["Linked List", "Recursion"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
    {
      id: "8",
      title: "Best Time to Buy and Sell Stock",
      slug: "best-time-to-buy-and-sell-stock",
      difficulty: "easy",
      tags: ["Array", "Dynamic Programming"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
    {
      id: "9",
      title: "Maximum Subarray",
      slug: "maximum-subarray",
      difficulty: "medium",
      tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
    {
      id: "10",
      title: "Container With Most Water",
      slug: "container-with-most-water",
      difficulty: "medium",
      tags: ["Array", "Two Pointers", "Greedy"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
    {
      id: "11",
      title: "3Sum",
      slug: "3sum",
      difficulty: "medium",
      tags: ["Array", "Two Pointers", "Sorting"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "12",
      title: "Longest Palindromic Substring",
      slug: "longest-palindromic-substring",
      difficulty: "medium",
      tags: ["String", "Dynamic Programming"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "13",
      title: "Trapping Rain Water",
      slug: "trapping-rain-water",
      difficulty: "hard",
      tags: ["Array", "Two Pointers", "Stack", "Dynamic Programming"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "14",
      title: "Merge Two Sorted Lists",
      slug: "merge-two-sorted-lists",
      difficulty: "easy",
      tags: ["Linked List", "Recursion"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
    {
      id: "15",
      title: "Remove Duplicates from Sorted Array",
      slug: "remove-duplicates-from-sorted-array",
      difficulty: "easy",
      tags: ["Array", "Two Pointers"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
    {
      id: "16",
      title: "Search in Rotated Sorted Array",
      slug: "search-in-rotated-sorted-array",
      difficulty: "medium",
      tags: ["Array", "Binary Search"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
    {
      id: "17",
      title: "Combination Sum",
      slug: "combination-sum",
      difficulty: "medium",
      tags: ["Array", "Backtracking"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "18",
      title: "Rotate Image",
      slug: "rotate-image",
      difficulty: "medium",
      tags: ["Array", "Math", "Matrix"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
    {
      id: "19",
      title: "Group Anagrams",
      slug: "group-anagrams",
      difficulty: "medium",
      tags: ["Array", "Hash Table", "String", "Sorting"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "20",
      title: "Maximum Product Subarray",
      slug: "maximum-product-subarray",
      difficulty: "medium",
      tags: ["Array", "Dynamic Programming"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
    {
      id: "21",
      title: "Find Minimum in Rotated Sorted Array",
      slug: "find-minimum-in-rotated-sorted-array",
      difficulty: "medium",
      tags: ["Array", "Binary Search"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
    {
      id: "22",
      title: "Word Search",
      slug: "word-search",
      difficulty: "medium",
      tags: ["Array", "Backtracking", "Matrix"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "23",
      title: "Number of Islands",
      slug: "number-of-islands",
      difficulty: "medium",
      tags: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
      memoryLimit: 512,
      timeLimitSeconds: 2,
    },
    {
      id: "24",
      title: "Course Schedule",
      slug: "course-schedule",
      difficulty: "medium",
      tags: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "25",
      title: "LRU Cache",
      slug: "lru-cache",
      difficulty: "medium",
      tags: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"],
      memoryLimit: 512,
      timeLimitSeconds: 2,
    },
    {
      id: "26",
      title: "Serialize and Deserialize Binary Tree",
      slug: "serialize-and-deserialize-binary-tree",
      difficulty: "hard",
      tags: ["String", "Tree", "Depth-First Search", "Breadth-First Search", "Design", "Binary Tree"],
      memoryLimit: 512,
      timeLimitSeconds: 2,
    },
    {
      id: "27",
      title: "Word Ladder",
      slug: "word-ladder",
      difficulty: "hard",
      tags: ["Hash Table", "String", "Breadth-First Search"],
      memoryLimit: 512,
      timeLimitSeconds: 2,
    },
    {
      id: "28",
      title: "Longest Consecutive Sequence",
      slug: "longest-consecutive-sequence",
      difficulty: "medium",
      tags: ["Array", "Hash Table", "Union Find"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "29",
      title: "Clone Graph",
      slug: "clone-graph",
      difficulty: "medium",
      tags: ["Hash Table", "Depth-First Search", "Breadth-First Search", "Graph"],
      memoryLimit: 256,
      timeLimitSeconds: 2,
    },
    {
      id: "30",
      title: "House Robber",
      slug: "house-robber",
      difficulty: "medium",
      tags: ["Array", "Dynamic Programming"],
      memoryLimit: 256,
      timeLimitSeconds: 1,
    },
  ];

  // Create all tags first
  const allTagNames = new Set<string>();
  problemsData.forEach((problem) => {
    problem.tags.forEach((tag) => allTagNames.add(tag));
  });

  console.log("🏷️  Creating tags...");
  const tagMap = new Map<string, any>();
  for (const tagName of allTagNames) {
    const tag = await prisma.tags.upsert({
      where: { title: tagName },
      update: {},
      create: { title: tagName },
    });
    tagMap.set(tagName, tag);
  }
  console.log(`✅ Created ${tagMap.size} tags`);

  // Create problems
  console.log("📝 Creating problems...");
  for (const problemData of problemsData) {
    const tags = problemData.tags.map((tagName) => tagMap.get(tagName));
    
    // Calculate time_limit as DateTime (current time + timeLimitSeconds)
    const timeLimit = new Date();
    timeLimit.setSeconds(timeLimit.getSeconds() + problemData.timeLimitSeconds);

    const problem = await prisma.problems.create({
      data: {
        id: problemData.id,
        name: problemData.title,
        difficulty: getDifficulty(problemData.difficulty),
        time_limit: timeLimit,
        memory_limit: problemData.memoryLimit,
        published: true,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
    });

    console.log(`✅ Created problem: ${problem.name} (${problem.difficulty})`);
  }

  console.log(`✅ Created ${problemsData.length} problems`);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
