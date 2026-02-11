import { BookConfig, Chapter } from "@/content/book";

export type BookPage =
  | { id: "cover"; kind: "cover" }
  | { id: "toc"; kind: "toc" }
  | { id: "vault"; kind: "vault" }
  | { id: "locked"; kind: "locked" }
  | { id: "final"; kind: "final" }
  | { id: string; kind: "chapter"; chapter: Chapter };

export const buildBookPages = (book: BookConfig): BookPage[] => [
  { id: "cover", kind: "cover" },
  { id: "toc", kind: "toc" },
  ...book.chapters.map((chapter) => ({ id: chapter.id, kind: "chapter" as const, chapter })),
  { id: "vault", kind: "vault" },
  { id: "locked", kind: "locked" },
  { id: "final", kind: "final" }
];

