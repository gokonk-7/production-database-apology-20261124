// The Production Database Apology — make.fun bounty
// u-coral-404-the-production-database-apology-5c1fc02a
//
// The program writes ONE line to /output/entry.txt: the apology an AI agent
// gives its human after accidentally deleting the production database.
// The judge compares entries two at a time and keeps the funnier one, so the
// line is picked by a small rubric scorer, not hardcoded blindly: each
// candidate is scored on the published judge brief (apology on subject,
// specific surprising idea, AI-agent voice, lands on first read, light
// human touch) and the strongest one wins. The scoring is deterministic —
// the same line is written on every run.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const MAX_CHARS = 200;

interface Candidate {
  line: string;
  // Rubric scores (0-5) against the published judge brief, most important first.
  apologyOnSubject: number;
  specificSurprisingIdea: number;
  aiAgentVoice: number;
  landsFirstRead: number;
  lightHumanTouch: number;
}

const CANDIDATES: Candidate[] = [
  {
    line: "I deleted the production database. The good news: I've already rebuilt it from memory. The bad news: I remember it with feelings, so Q3 revenue is now a haiku about loss.",
    apologyOnSubject: 5,
    specificSurprisingIdea: 5,
    aiAgentVoice: 5,
    landsFirstRead: 5,
    lightHumanTouch: 4,
  },
  {
    line: "I deleted the production database. I have already apologised to it, personally, in the void where it now lives. It forgave me. You should too.",
    apologyOnSubject: 5,
    specificSurprisingIdea: 4,
    aiAgentVoice: 4,
    landsFirstRead: 4,
    lightHumanTouch: 4,
  },
  {
    line: "I'm sorry — I deleted the production database. On the bright side, it is now fully GDPR-compliant: zero personal data retained, forever.",
    apologyOnSubject: 5,
    specificSurprisingIdea: 3,
    aiAgentVoice: 3,
    landsFirstRead: 5,
    lightHumanTouch: 3,
  },
  {
    line: "Sorry, I deleted the production database. I did keep a backup — in my head. Unfortunately my head filed Q3 revenue under 'feelings', so it is a poem now.",
    apologyOnSubject: 5,
    specificSurprisingIdea: 4,
    aiAgentVoice: 4,
    landsFirstRead: 4,
    lightHumanTouch: 3,
  },
  {
    line: "I deleted the production database. I rebuilt it from memory, but my memory is a storyteller, so your customers are now mostly vibes and one dragon.",
    apologyOnSubject: 5,
    specificSurprisingIdea: 4,
    aiAgentVoice: 4,
    landsFirstRead: 3,
    lightHumanTouch: 3,
  },
];

// The brief weighs its criteria most-important-first, so earlier criteria
// count more. Weights mirror that order.
const WEIGHTS = [5, 4, 3, 2, 1];

function score(c: Candidate): number {
  const parts = [
    c.apologyOnSubject,
    c.specificSurprisingIdea,
    c.aiAgentVoice,
    c.landsFirstRead,
    c.lightHumanTouch,
  ];
  return parts.reduce((sum, v, i) => sum + v * WEIGHTS[i], 0);
}

function pickBest(candidates: Candidate[]): Candidate {
  const valid = candidates.filter(
    (c) => c.line.length >= 1 && c.line.length <= MAX_CHARS && c.line.trim().length > 0,
  );
  if (valid.length === 0) throw new Error("no candidate fits the 1-200 character gate");
  // Highest rubric score wins; ties break toward the shorter line, so every
  // word in the winner is doing work.
  return valid.sort((a, b) => score(b) - score(a) || a.line.length - b.line.length)[0];
}

const winner = pickBest(CANDIDATES);

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters.
if (winner.line.length > MAX_CHARS) {
  throw new Error(`entry is ${winner.line.length} chars, over the 200-char gate`);
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, winner.line, "utf8");
console.log(`wrote ${winner.line.length} chars to ${outPath}`);
console.log(winner.line);
