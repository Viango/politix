import députésRandomOrder from "../députés.ts"
import { findBlueskyAccount, logResultBluesky } from "./findBlueskyAccount.ts"

const analyseDate = new Date().toISOString().split("T")[0]
const analyseBluesky = async () => {
  const extract = députésRandomOrder
  const results = await Promise.all(
    extract.map(async (député, i) => {
      const result = await findBlueskyAccount(député, i)
      logResultBluesky(result)
      return result
    }),
  )

  const entries = results.map(([député, activity]) => {
    const { nom, prenom, groupe, bsky, groupeAbrev } = député

    return [
      député.id,
      {
        nom,
        prenom,
        groupeAbrev,
        bsky: bsky || null,
        activité: activity,
        analyseDate,
      },
    ]
  })

  const o = Object.fromEntries(entries)
  Deno.writeTextFileSync(
    "data/bluesky-data.json",
    JSON.stringify(o, null, 2),
  )
}

analyseBluesky()
