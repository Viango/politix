// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx"
import * as $_app from "./routes/_app.tsx"
import * as $bluesky from "./routes/bluesky.tsx"
import * as $europe_bluesky from "./routes/europe/bluesky.tsx"
import * as $europe_index from "./routes/europe/index.tsx"
import * as $europe_mastodon from "./routes/europe/mastodon.tsx"
import * as $europe_parti_party_ from "./routes/europe/parti/[party].tsx"
import * as $fr_index from "./routes/fr/index.tsx"
import * as $gouvernement_index from "./routes/gouvernement/index.tsx"
import * as $greet_name_ from "./routes/greet/[name].tsx"
import * as $index from "./routes/index.tsx"
import * as $mastodon from "./routes/mastodon.tsx"
import * as $méthodologie_index from "./routes/méthodologie/index.tsx"
import * as $parlement_index from "./routes/parlement/index.tsx"
import * as $parti_party_ from "./routes/parti/[party].tsx"
import * as $Counter from "./islands/Counter.tsx"
import * as $OpenBlueskyTabs from "./islands/OpenBlueskyTabs.tsx"
import type { Manifest } from "$fresh/server.ts"

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/bluesky.tsx": $bluesky,
    "./routes/europe/bluesky.tsx": $europe_bluesky,
    "./routes/europe/index.tsx": $europe_index,
    "./routes/europe/mastodon.tsx": $europe_mastodon,
    "./routes/europe/parti/[party].tsx": $europe_parti_party_,
    "./routes/fr/index.tsx": $fr_index,
    "./routes/gouvernement/index.tsx": $gouvernement_index,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
    "./routes/mastodon.tsx": $mastodon,
    "./routes/méthodologie/index.tsx": $méthodologie_index,
    "./routes/parlement/index.tsx": $parlement_index,
    "./routes/parti/[party].tsx": $parti_party_,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./islands/OpenBlueskyTabs.tsx": $OpenBlueskyTabs,
  },
  baseUrl: import.meta.url,
} satisfies Manifest

export default manifest
