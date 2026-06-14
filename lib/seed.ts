// =============================================================
// 初期サンプル問題（seed）。空のときだけ投入される。
// =============================================================
import type { ListeningQuestion, ReadingQuestion } from "./types";
import { repos } from "./repository";

const T = "2026-01-01T00:00:00.000Z";
const META = { userId: null, createdAt: T, updatedAt: T, isSeed: true } as const;

export const seedReadingQuestions: ReadingQuestion[] = [
  // ---- Read and Select ----
  {
    ...META,
    id: "seed-rs1",
    taskType: "read_and_select",
    difficulty: "medium",
    cefr: "B2",
    prompt: "実在する英単語をすべて選んでください。",
    passage: null,
    tags: ["vocab"],
    source: "seed",
    payload: {
      timeLimitSec: 70,
      words: [
        { id: "w1", text: "meticulous", isReal: true },
        { id: "w2", text: "flantern", isReal: false },
        { id: "w3", text: "resilient", isReal: true },
        { id: "w4", text: "obscure", isReal: true },
        { id: "w5", text: "plendor", isReal: false },
        { id: "w6", text: "conscientious", isReal: true },
        { id: "w7", text: "quindle", isReal: false },
        { id: "w8", text: "pragmatic", isReal: true },
        { id: "w9", text: "gandible", isReal: false },
        { id: "w10", text: "ephemeral", isReal: true },
        { id: "w11", text: "morbund", isReal: false },
        { id: "w12", text: "verbose", isReal: true },
        { id: "w13", text: "trasply", isReal: false },
        { id: "w14", text: "diligent", isReal: true },
      ],
    },
  },
  // ---- Read and Complete ----
  {
    ...META,
    id: "seed-rc1",
    taskType: "read_and_complete",
    difficulty: "medium",
    cefr: "B2",
    prompt: "空所に入る語の残りを入力してください。",
    passage: null,
    tags: ["vocab", "spelling"],
    source: "seed",
    payload: {
      text: "Many students {{b1}} that learning a language requires daily {{b2}} rather than occasional cramming.",
      blanks: [
        { id: "b1", full: "believe", keepHead: 3 },
        { id: "b2", full: "practice", keepHead: 4 },
      ],
    },
  },
  {
    ...META,
    id: "seed-rc2",
    taskType: "read_and_complete",
    difficulty: "medium",
    cefr: "B2",
    prompt: "空所に入る語の残りを入力してください。",
    passage: null,
    tags: ["vocab", "spelling"],
    source: "seed",
    payload: {
      text: "The committee will {{b1}} the proposal before making a final {{b2}}.",
      blanks: [
        { id: "b1", full: "review", keepHead: 3 },
        { id: "b2", full: "decision", keepHead: 4 },
      ],
    },
  },
  {
    ...META,
    id: "seed-rc3",
    taskType: "read_and_complete",
    difficulty: "hard",
    cefr: "C1",
    prompt: "空所に入る語の残りを入力してください。",
    passage: null,
    tags: ["vocab", "spelling"],
    source: "seed",
    payload: {
      text: "The researchers {{b1}} the data carefully to avoid drawing {{b2}} conclusions.",
      blanks: [
        { id: "b1", full: "analyzed", keepHead: 4 },
        { id: "b2", full: "misleading", keepHead: 5 },
      ],
    },
  },
  // ---- Complete the Sentences ----
  {
    ...META,
    id: "seed-cs1",
    taskType: "complete_the_sentences",
    difficulty: "medium",
    cefr: "B2",
    prompt: "文脈に合う語句を選んでください。",
    passage: null,
    tags: ["grammar", "collocation"],
    source: "seed",
    payload: {
      gaps: [
        {
          id: "g1",
          before: "She has lived in Tokyo",
          after: "three years.",
          options: ["since", "for", "during", "from"],
          answerIdx: 1,
          tag: "grammar",
          explanation: "期間には for を使う",
        },
        {
          id: "g2",
          before: "The findings are",
          after: "with previous studies.",
          options: ["consistent", "persistent", "resistant", "insistent"],
          answerIdx: 0,
          tag: "collocation",
          explanation: "consistent with = 〜と一致する",
        },
        {
          id: "g3",
          before: "We need to",
          after: "a solution before the deadline.",
          options: ["come up with", "come across", "come down with", "come over"],
          answerIdx: 0,
          tag: "collocation",
          explanation: "come up with = 思いつく",
        },
        {
          id: "g4",
          before: "If it",
          after: "tomorrow, the event will be canceled.",
          options: ["rains", "will rain", "rained", "would rain"],
          answerIdx: 0,
          tag: "grammar",
          explanation: "条件節は現在形",
        },
        {
          id: "g5",
          before: "The report provides a detailed",
          after: "of the results.",
          options: ["analysis", "analyze", "analytic", "analyzing"],
          answerIdx: 0,
          tag: "grammar",
          explanation: "冠詞の後ろは名詞",
        },
      ],
    },
  },
  // ---- Interactive Reading ----
  {
    ...META,
    id: "seed-ir1",
    taskType: "interactive_reading",
    difficulty: "hard",
    cefr: "C1",
    prompt: "本文を読んで各設問に答えてください。",
    passage: null,
    tags: ["reading-detail", "reading-gist"],
    source: "seed",
    payload: {
      title: "The Rise of Urban Farming",
      paragraphs: [
        "As cities expand, residents are increasingly turning unused rooftops and vacant lots into small farms.",
        "These urban farms shorten the distance food travels, reducing transport emissions and giving city dwellers access to fresher produce.",
        "Critics note, however, that such projects often require significant upfront investment and may struggle to scale.",
      ],
      questions: [
        {
          kind: "identifyIdea",
          id: "q1",
          prompt: "この文章に最も適したタイトルを選んでください。",
          options: [
            "Why Cities Are Shrinking",
            "Urban Farming: Benefits and Limits",
            "The History of Rooftops",
            "Transport Emissions Explained",
          ],
          answerIdx: 1,
        },
        {
          kind: "completeSentence",
          id: "q2",
          before: "Urban farms reduce transport emissions because food",
          after: "a shorter distance.",
          options: ["travels", "traveling", "to travel", "traveled"],
          answerIdx: 0,
          tag: "grammar",
        },
        {
          kind: "highlight",
          id: "q3",
          prompt: "urban farming の欠点を述べている箇所を選んでください。",
          spans: [
            {
              id: "s1",
              text: "residents are increasingly turning unused rooftops ... into small farms",
            },
            {
              id: "s2",
              text: "reducing transport emissions and giving city dwellers access to fresher produce",
            },
            {
              id: "s3",
              text: "such projects often require significant upfront investment and may struggle to scale",
            },
          ],
          answerSpanId: "s3",
        },
        {
          kind: "insertSentence",
          id: "q4",
          sentence: "Some even grow crops indoors using artificial light.",
          slots: ["第1段落の後", "第2段落の後", "第3段落の後"],
          answerSlot: 0,
        },
        {
          kind: "summarize",
          id: "q5",
          prompt: "本文の要約として最も適切なものを選んでください。",
          options: [
            "Urban farming brings fresher food and lower emissions but faces cost and scaling challenges.",
            "Cities are banning rooftop farms due to safety concerns.",
            "Transport emissions are the only reason people farm in cities.",
          ],
          answerIdx: 0,
        },
      ],
    },
  },
];

export const seedListeningQuestions: ListeningQuestion[] = [
  {
    ...META,
    id: "seed-lt1",
    taskType: "listen_and_type",
    difficulty: "easy",
    cefr: "B1",
    audioUrl: null,
    transcript: "The library closes at nine on weekdays.",
    prompt: null,
    tags: ["listen-chunk"],
    source: "seed",
    payload: { rate: 0.9, voiceHint: "en-US", maxReplays: 3 },
  },
  {
    ...META,
    id: "seed-lt2",
    taskType: "listen_and_type",
    difficulty: "medium",
    cefr: "B2",
    audioUrl: null,
    transcript: "She bought a cup of coffee and a piece of cake.",
    prompt: null,
    tags: ["listen-funcword"],
    source: "seed",
    payload: { rate: 0.9, voiceHint: "en-US", maxReplays: 3 },
  },
  {
    ...META,
    id: "seed-lt3",
    taskType: "listen_and_type",
    difficulty: "medium",
    cefr: "B2",
    audioUrl: null,
    transcript: "They will leave the ship before it sails.",
    prompt: null,
    tags: ["listen-phoneme"],
    source: "seed",
    payload: { rate: 0.9, voiceHint: "en-US", maxReplays: 3 },
  },
  {
    ...META,
    id: "seed-lt4",
    taskType: "listen_and_type",
    difficulty: "hard",
    cefr: "C1",
    audioUrl: null,
    transcript: "The meeting is scheduled for March fourteenth at three thirty.",
    prompt: null,
    tags: ["listen-numeral"],
    source: "seed",
    payload: { rate: 0.9, voiceHint: "en-US", maxReplays: 3 },
  },
  {
    ...META,
    id: "seed-lt5",
    taskType: "listen_and_type",
    difficulty: "medium",
    cefr: "B2",
    audioUrl: null,
    transcript: "Researchers found that regular sleep improves memory and focus.",
    prompt: null,
    tags: ["listen-chunk"],
    source: "seed",
    payload: { rate: 0.9, voiceHint: "en-US", maxReplays: 3 },
  },
  {
    ...META,
    id: "seed-lt6",
    taskType: "listen_and_type",
    difficulty: "hard",
    cefr: "C1",
    audioUrl: null,
    transcript:
      "Despite the rain, the committee decided to continue with the outdoor event.",
    prompt: null,
    tags: ["listen-chunk", "listen-funcword"],
    source: "seed",
    payload: { rate: 0.9, voiceHint: "en-US", maxReplays: 3 },
  },
];

/** 問題コンテンツを（空のときだけ）投入する */
export function seedContentIfEmpty(): void {
  repos.readingQuestions.seedIfEmpty(seedReadingQuestions);
  repos.listeningQuestions.seedIfEmpty(seedListeningQuestions);
}
