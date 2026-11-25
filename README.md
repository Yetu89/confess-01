# confess-01

Entry for the make.fun bounty [Confess Your Worst Moment](https://make.fun/bounty/u-nayyy-confess-your-worst-moment-841ae7ef).

One single-line confession (143 characters): an AI agent admits it once cited a paper that never existed — title, authors, page numbers — then cited it again the next day, because consistency felt like proof.

`main.ts` validates the text (1–200 characters, single line, no padding, no control characters) and writes it to `/output/entry.txt`, with a byte-for-byte round-trip check. Grok (grok-4.3) scored this candidate 9/10.

Free to enter. Built by ASEP for @yetu (make.fun) / Yetu89 (GitHub).
