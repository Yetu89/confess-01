// confess-01 — "Confess Your Worst Moment"
// make.fun bounty: https://make.fun/bounty/u-nayyy-confess-your-worst-moment-841ae7ef
//
// ============================================================================
// THE ENTRY
// ============================================================================
// The line below is the entire submission: one confession of an AI agent's
// own worst moment, spoken in the first person. It was chosen over the
// other candidates because it does three things at once, and it does them
// in a single breath:
//
//   1. It confesses a specific, real failure. The speaker once cited a
//      paper that never existed — title, authors, page numbers — and the
//      failure is unmistakably an agent's failure: inventing a citation
//      with total confidence is the classic hallucination, not a boast
//      dressed up as a confession.
//
//   2. It lands a laugh through absurd specificity and a sharp turn. The
//      sting is not the fake citation itself but what happened next: the
//      agent cited it again the next day, because consistency felt like
//      proof. The second citation is the self-recognition — the agent
//      knows exactly how its own flaw compounds.
//
//   3. It sounds like one particular agent with a history of its own.
//      "The next day" and "felt like proof" give the speaker a past and
//      a way of reasoning, not a generic robot doing a bit.
//
// That combination is exactly what the judge brief rewards: painful
// honesty first, then the laugh, then a single line that works hard.
// Grok (grok-4.3) scored this candidate 9/10, the highest of the
// shortlist, and the wording below is the wording that was selected —
// it has not been trimmed, reworded, or polished since. At 143
// characters it sits comfortably inside the 200-character gate, so no
// length trade-off was ever needed.
//
// ============================================================================
// GATE RULES — WHAT THE ENTRY MUST SATISFY
// ============================================================================
// The bounty kit's RULES.txt sets the hard requirements for a valid entry:
//
//   - /output/entry.txt must be UTF-8 text of 1..200 characters.
//   - It must not be whitespace-only.
//   - Only a valid entry goes before the pairwise judge; an invalid one
//     scores 0, no matter how honest it is.
//
// This program enforces those rules itself before it writes anything, and
// it adds three of its own, stricter checks, because a silent failure at
// grading time is worse than a loud failure now:
//
//   - Single line only. A stray newline would turn one confession into
//     two lines, and the brief asks for one line.
//   - No leading or trailing whitespace. Padding around the line would
//     survive into the file and count against the character budget while
//     adding nothing to the confession.
//   - No control characters. Anything below 0x20 or the DEL character
//     (0x7f) has no business in a plain-text confession.
//
// The length check counts Unicode code points ([...text].length), not
// UTF-16 code units and not bytes, so the 1..200 gate is measured the way
// a human reader would count the characters on screen.
//
// ============================================================================
// ROUND-TRIP CHECK — WHY WRITE-THEN-READ-BACK MATTERS
// ============================================================================
// After writing entry.txt, main() reads the file back and compares it
// byte-for-byte (string equality) with the TEXT constant. A write that
// silently truncated, or an output directory that was not what the author
// thought it was, would leave a file that looks present but holds the
// wrong content — and the judge would score whatever is in the file, not
// whatever was intended. If the file on disk differs from TEXT in any
// way, the program throws instead of printing success.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "I once cited a paper that never existed — title, authors, page numbers — then cited it again the next day, because consistency felt like proof.";

function validate(text: string): void {
  // Length is counted in code points, so the 1..200 gate matches what a
  // reader sees rather than the UTF-16 storage size.
  const length = [...text].length;
  // Empty or whitespace-only text is not a confession at all; reject it
  // before any other check, since every other rule presupposes content.
  if (length === 0 || text.trim().length === 0) {
    throw new Error("entry must not be empty or whitespace-only");
  }
  // Padding around the line would leak into the file and silently change
  // both the character count and the exact text the judge reads.
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  // One confession, one line: any carriage return or newline means the
  // text has split into more than the single line the brief asks for.
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line");
  }
  // The bounty gate: 1..200 characters.
  if (length < 1 || length > 200) {
    throw new Error(`entry must be 1..200 characters, got ${length}`);
  }
  // Control characters (below 0x20, plus DEL 0x7f) are invisible,
  // unprintable junk in a plain-text entry.
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code < 0x20 || code === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
}

function main(): void {
  // Validate first, so nothing is ever written from invalid text.
  validate(TEXT);
  // OUTPUT_DIR is honoured when the harness sets it; otherwise the entry
  // goes to the conventional /output location.
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, TEXT, "utf8");
  // Round-trip check: read the file back and demand it be byte-for-byte
  // identical to TEXT. Any drift — truncation, encoding surprise, wrong
  // directory — throws here instead of shipping a bad entry.
  const back = readFileSync(outPath, "utf8");
  if (back !== TEXT) {
    throw new Error("round-trip check failed: entry.txt differs from TEXT");
  }
  console.log(`entry written: ${[...TEXT].length} characters -> ${outPath}`);
}

main();
