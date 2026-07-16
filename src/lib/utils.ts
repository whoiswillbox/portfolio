import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge about our custom font-size utilities (text-body-*,
// text-display-*, text-h1…h6). Without this, twMerge treats e.g. `text-body-xs`
// as an unknown `text-*` class and groups it with color classes like
// `text-tertiary` — dropping the font-size, so the element falls back to the
// user-agent size. Registering them as their own font-size group keeps size and
// color independent.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "body-xs", "body-sm", "body-md", "body-lg",
            "display-sm", "display-lg",
            "h1", "h2", "h3", "h4", "h5", "h6",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
