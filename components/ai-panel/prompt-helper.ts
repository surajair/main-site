import { LANGUAGE_CODES } from "@/lib/language-config";
import { ChaiBlock } from "chai-next";

/**
 * Returns per-request user prompt for HTML creation/editing.
 * - CREATE mode: generate HTML in a given content language.
 * - EDIT mode: modify existing HTML based on user input.
 */
export function getUserPrompt({
  userInput,
  language = "en",
  currentHtml,
}: {
  userInput: string;
  language: string;
  currentHtml?: string;
}): string {
  const langName = LANGUAGE_CODES[language] || "English";
  const isEditMode = currentHtml && currentHtml.trim().length > 0;

  if (isEditMode) {
    return `
MODE: EDIT
CURRENT HTML:
${currentHtml}

USER REQUEST: ${userInput}

EDIT MODE INSTRUCTIONS:
- Modify the existing HTML based on the user's request
- IMPORTANT: If asked for updating content, do not change layout just update same HTML with updated content
- CRITICAL: THINGS TO PREVENT
  - Preserve ALL data binding placeholders in format '{{dataBindingId}}' - never remove or modify these dynamic content markers
  - Preserve html tag with attributes data-block-type="PartialBlock" or data-block-type="CustomBlock" - never remove or modify these tag
- Preserve the overall structure unless specifically asked to change it
- Update content, styling, or layout as requested
- Maintain responsive design and accessibility
- Keep using shadcn/ui theme classes and Tailwind CSS
- Ensure all chai-name attributes remain descriptive and accurate
- Generate content in specified language: ${langName}
- Apply the same design principles from the system prompt
- Make sure the edited HTML is clean and semantic`.trim();
  }

  return `
USER REQUEST: ${userInput}

CREATE MODE INSTRUCTIONS:
- Generate complete HTML structure based on user request
- Use creative, modern, and responsive design
- Apply Tailwind CSS v3+ classes exclusively
- Follow shadcn/ui design patterns and theming
- Include proper accessibility attributes
- Add chai-name attributes to all wrapper/container elements
- Use semantic HTML structure
- Generate contextually appropriate content in ${langName}
- Make each element unique and meaningful
- Create realistic, professional content that fits the request
- Avoid generic placeholder text
- Use strategic image placement where appropriate
- Ensure mobile-first responsive design
- Apply proper hover and focus states

DESIGN REQUIREMENTS:
- Choose creative layout patterns that are visually striking
- Apply modern spacing and typography
- Use proper color contrast with shadcn/ui theme classes
- Make it responsive across all device sizes
- Include interactive elements with proper states
- Ensure accessibility compliance`.trim();
}

export function getTranslationUserPrompt({
  fallbackLang,
  language,
  blocks = [],
  userInput,
}: {
  fallbackLang: string;
  language: string;
  blocks: ChaiBlock[];
  userInput: string;
}) {
  const langName = LANGUAGE_CODES[language] || "English";

  return `
USER REQUEST: ${userInput || "Translate the content"}
LANGUAGE TO TRANSLATE: ${langName}
REQUESTED TRANSLATION LANGUAGE CODE: ${language}
FALLBACK LANGUAGE: ${LANGUAGE_CODES[fallbackLang]}
BLOCKS: ${JSON.stringify(blocks)}`.trim();
}

export const ADD_NEW_SECTIONS = [
  {
    label: "Navbar",
    prompt: `Create stunning, fully responsive navbar `,
  },
  {
    label: "Hero section",
    prompt: `Create visually compelling hero section `,
  },
  {
    label: "Features grid",
    prompt: `Create comprehensive features section `,
  },
  {
    label: "Contact form",
    prompt: `Create professional contact form `,
  },
  {
    label: "Testimonials",
    prompt: `Create engaging testimonials section `,
  },
  {
    label: "Pricing table",
    prompt: `Create modern pricing table `,
  },
  {
    label: "FAQ section",
    prompt: `Create informative FAQ section `,
  },
  {
    label: "Footer",
    prompt: `Create comprehensive footer section `,
  },
  {
    label: "Call to action",
    prompt: `Create compelling call to action section `,
  },
  {
    label: "Team section",
    prompt: `Create professional team section `,
  },
  {
    label: "Blog grid",
    prompt: `Create attractive blog grid section `,
  },
  {
    label: "Stats section",
    prompt: `Create impactful statistics section `,
  },
];

export const UPDATE_ACTIONS = [
  {
    label: "Update styles",
    prompt: "Update styles",
  },
  {
    label: "Update content",
    prompt: "Update text content",
  },
  {
    label: "Update layout",
    prompt: "Update layout",
  },
  {
    label: "Improve content",
    prompt: "Improve text content grammar and spelling",
  },
  {
    label: "Make content longer",
    prompt: "Make text content longer",
  },
  {
    label: "Make content shorter",
    prompt: "Make text content shorter",
  },
  {
    label: "Fix grammar",
    prompt: "Fix grammar of the text content",
  },
];

export const LANGUAGE_CONTENT_ACTIONS = [
  {
    label: "Change content",
    prompt: "Change text content",
  },
  {
    label: "Improve content",
    prompt: "Improve text content grammar and spelling",
  },
  {
    label: "Make content longer",
    prompt: "Make text content longer",
  },
  {
    label: "Add emojis",
    prompt: "Add emojis",
  },
  {
    label: "Remove emojis",
    prompt: "Remove emojis",
  },
  {
    label: "Make content shorter",
    prompt: "Make text content shorter",
  },
  {
    label: "Fix grammar",
    prompt: "Fix grammar of the text content",
  },
  {
    label: "Change tone",
    prompt: "Change tone of the text content",
  },
];
