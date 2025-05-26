# 🟣 Portfolio Page, External Links & Hosting Sprint

Build a complete, beautiful, and hostable portfolio page that renders a user’s parsed data, showcases external links/projects, and enables one-click export & deployment.

---

## 🎯 Goal

1. Render a dynamic portfolio page at `/dashboard/profile/[id]` showing all profile sections.
2. Add an **External Links** widget for project & social links.
3. Provide **Publish & Host** functionality: export static HTML+assets as a ZIP and optionally deploy to Vercel.

---

## 🚀 Tasks

| #      | Task                                                                                          | File(s)                                                        | Commit Msg                                   |
| ------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------- |
| **1**  | **Profile Page Skeleton**: Dynamic route under `/dashboard/profile/[id]`                      | `app/dashboard/profile/[id]/page.tsx`                          | `feat(page): create profile dynamic route`   |
| **2**  | **Data Fetch Stub**: `getProfileById(id)` stub in lib                                         | `lib/profiles.ts`                                              | `feat(data): stub getProfileById()`          |
| **3**  | **Render Profile Sections**: Name, Headline, Summary, Experience, Education, Skills           | `page.tsx`                                                     | `feat(ui): render profile template`          |
| **4**  | **External LinksList**: Component maps `profile.links` to icons+labels, hides in print        | `components/LinksList.tsx`                                     | `feat(ui): add LinksList component`          |
| **5**  | **Integrate LinksList**: Render `<LinksList>` below summary on the profile page               | `page.tsx`                                                     | `feat(ui): render external links on profile` |
| **6**  | **Publish Button UI**: Add “Publish Portfolio” button next to Download on profile page        | `components/PublishButton.tsx`, `page.tsx`                     | `feat(ui): add Publish Portfolio button`     |
| **7**  | **Export API Route**: `app/api/portfolio/export/route.ts` to render static HTML & zip         | `app/api/portfolio/export/route.ts`                            | `feat(api): static export portfolio route`   |
| **8**  | **Client Download Logic**: Fetch `/api/portfolio/export`, trigger ZIP download                | `PublishButton.tsx`                                            | `feat(ui): download portfolio zip`           |
| **9**  | **Styling & Polishing**: Tailwind theme, `<head>` tags, inline CSS for export, responsive     | `globals.css`, CSS + `export/route.ts`                         | `chore(ui): inline styles for static export` |
| **10** | **(Optional) Vercel Deploy**: API route to deploy via Vercel/GitHub, show live URL pill       | `app/api/portfolio/deploy/route.ts`, `.env.local`              | `feat(api): add Vercel deployment endpoint`  |
| **11** | **E2E Smoke Tests**: Profile page loads, links count, ZIP download and deploy to preview site | `tests/profile-page.spec.ts`, `tests/portfolio-export.spec.ts` | `test(ui+api): portfolio page & export flow` |

---

## 📋 Example Code Snippets

### `lib/profiles.ts`

```ts
import { Profile } from "@/lib/types";
const DUMMY: Record<string, Profile> = {
  "123": { /* example JSON */ },
};
export function getProfileById(id: string): Profile | null {
  return DUMMY[id] ?? null;
}
```

### `components/LinksList.tsx`

```tsx
"use client";
import { FaLink, FaGithub, FaBehance, FaLinkedin, FaHuggingface } from "react-icons/fa";

export function LinksList({ links }: { links: { platform: string; url: string }[] }) {
  const ICONS: Record<string, JSX.Element> = {
    github: <FaGithub size={20} />, behance: <FaBehance size={20} />, linkedin: <FaLinkedin size={20} />, huggingface: <FaHuggingface size={20} />
  };
  return (
    <div className="flex flex-wrap gap-4 print:hidden mt-6">
      {links.map((l, i) => (
        <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600">
          {ICONS[l.platform.toLowerCase()] ?? <FaLink size={20} />}<span className="text-sm">{l.platform}</span>
        </a>
      ))}
    </div>
  );
}
```

### `components/PublishButton.tsx`

```tsx
"use client";
import { useState } from "react";

export default function PublishButton() {
  const [loading, setLoading] = useState(false);
  async function handlePublish() {
    setLoading(true);
    const res = await fetch("/api/portfolio/export");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "portfolio.zip"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    setLoading(false);
  }
  return (<button onClick={handlePublish} disabled={loading} className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
    {loading ? "Publishing…" : "Publish Portfolio"}
  </button>);
}
```

---

## 🛠️ Next Steps

1. Work tasks **1–5** to fully render the portfolio page with external links.
2. Add **Task 6** button and **Task 7** export route.
3. Hook up **Task 8** download logic.
4. Polish inline styles for export (**Task 9**).
5. Optional Vercel deploy (**Task 10**).
6. Add smoke tests (**Task 11**) and update your Progress Tracker:

```md
| External links & hosting | ✅ | agent | 2025-05-23 |
```

Happy coding! 🚀
