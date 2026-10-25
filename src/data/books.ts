import type { Locale } from "@/i18n";

/**
 * Books on the Hobbies → Reading shelf.
 * `notes` holds Gen's own reading notes per locale; a book without notes shows none.
 * `characters` lists CharacterCarousel ids, so the shelf can jump to those cards.
 */

export type BookCategory = "polecon" | "wuxia" | "scifi" | "literature";

export interface Book {
  id: string;
  title: string;
  titleEn: string;
  author: string;
  category: BookCategory;
  recent?: boolean;
  about: Record<Locale, string>;
  characters?: string[];
  notes?: Partial<Record<Locale, string[]>>;
}

export const CATEGORY_ORDER: BookCategory[] = ["polecon", "wuxia", "scifi", "literature"];

export const CATEGORY_LABELS: Record<BookCategory, Record<Locale, string>> = {
  polecon: { en: "Politics & economy", zh: "政治与经济", de: "Politik & Wirtschaft" },
  wuxia: { en: "Wuxia", zh: "武侠", de: "Wuxia" },
  scifi: { en: "Science fiction", zh: "科幻", de: "Science-Fiction" },
  literature: { en: "Literature", zh: "文学", de: "Literatur" },
};

export const BOOKS: Book[] = [
  {
    id: "mao-terrill",
    title: "毛泽东传",
    titleEn: "Mao: A Biography",
    author: "罗斯·特里尔 Ross Terrill",
    category: "polecon",
    recent: true,
    about: {
      en: "A biography of Mao Zedong by the Australian-American China scholar Ross Terrill.",
      zh: "澳大利亚裔美国汉学家罗斯·特里尔写的毛泽东传记。",
      de: "Eine Biografie Mao Zedongs von dem australisch-amerikanischen Sinologen Ross Terrill.",
    },
  },
  {
    id: "deng-vogel",
    title: "邓小平时代",
    titleEn: "Deng Xiaoping and the Transformation of China",
    author: "傅高义 Ezra F. Vogel",
    category: "polecon",
    recent: true,
    about: {
      en: "Harvard scholar Ezra Vogel on Deng Xiaoping and China's reform and opening-up.",
      zh: "哈佛学者傅高义写邓小平与改革开放的那个时代。",
      de: "Der Harvard-Wissenschaftler Ezra Vogel über Deng Xiaoping und Chinas Reform- und Öffnungspolitik.",
    },
  },
  {
    id: "zhishen-shinei",
    title: "置身事内",
    titleEn: "China's Government and Economic Development",
    author: "兰小欢 Lan Xiaohuan",
    category: "polecon",
    recent: true,
    about: {
      en: "How China's local governments take part in the economy: public finance, land-based financing, debt, and industrial policy.",
      zh: "讲中国地方政府如何深度参与经济发展：财税、土地融资、债务与产业政策。",
      de: "Wie Chinas Lokalregierungen die Wirtschaft mitgestalten: öffentliche Finanzen, Bodenfinanzierung, Schulden und Industriepolitik.",
    },
  },
  {
    id: "condor-heroes",
    title: "射雕英雄传",
    titleEn: "The Legend of the Condor Heroes",
    author: "金庸 Jin Yong",
    category: "wuxia",
    about: {
      en: "Jin Yong's wuxia novel following Guo Jing from the Mongolian steppe to the Song dynasty's wars.",
      zh: "金庸的武侠小说，郭靖从蒙古草原一路走进宋金蒙的乱世。",
      de: "Jin Yongs Wuxia-Roman: Guo Jing zieht aus der mongolischen Steppe in die Kriege der Song-Zeit.",
    },
    characters: ["guo-jing"],
  },
  {
    id: "smiling-proud-wanderer",
    title: "笑傲江湖",
    titleEn: "The Smiling, Proud Wanderer",
    author: "金庸 Jin Yong",
    category: "wuxia",
    about: {
      en: "Jin Yong's wuxia novel about sect politics and power struggles, seen through Linghu Chong.",
      zh: "金庸写江湖门派与权力之争的武侠小说，主角令狐冲。",
      de: "Jin Yongs Wuxia-Roman über Sektenpolitik und Machtkämpfe, erzählt durch Linghu Chong.",
    },
    characters: ["linghu-chong"],
  },
  {
    id: "three-body",
    title: "三体",
    titleEn: "The Three-Body Trilogy",
    author: "刘慈欣 Liu Cixin",
    category: "scifi",
    about: {
      en: "Liu Cixin's trilogy: The Three-Body Problem, The Dark Forest, Death's End.",
      zh: "刘慈欣的科幻三部曲：《三体》《黑暗森林》《死神永生》。",
      de: "Liu Cixins Trilogie: Die drei Sonnen, Der dunkle Wald, Jenseits der Zeit.",
    },
    characters: ["ye-wenjie", "luo-ji", "zhang-beihai", "cheng-xin"],
  },
  {
    id: "demian",
    title: "Demian",
    titleEn: "Demian",
    author: "Hermann Hesse",
    category: "literature",
    about: {
      en: "Hesse's 1919 novel about young Emil Sinclair searching for himself.",
      zh: "黑塞 1919 年的小说，少年辛克莱寻找自我的故事。",
      de: "Hesses Roman von 1919 über den jungen Emil Sinclair auf der Suche nach sich selbst.",
    },
    characters: ["sinclair"],
  },
];
