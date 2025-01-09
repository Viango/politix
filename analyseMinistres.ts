// Merci https://gist.github.com/mouette/4cd38e6dce84bd232c78b77506d9a899#file-ministres-x-csv
import { launch } from 'jsr:@astral/astral'
import { parse } from 'jsr:@std/csv'
import { analyseDate } from './date-utils.ts'
import { delay } from './utils.ts'
import { findBlueskyAccount, logResult } from './findBlueskyAccount.ts'

const csv = Deno.readTextFileSync('ministres-x.csv')
const bskyFalsePositives = ['manuelvalls.bsky.social']

const ministres = parse(csv, {
  skipFirstRow: true,
  strip: true,
})

let file
try {
  file = Deno.readTextFileSync('ministres.json')
} catch (e) {
  file = '{}'
}

const alreadyDone = JSON.parse(file)
const doneEntries = Object.entries(alreadyDone)

const limit = Deno.args[0]
const initialDelay = Deno.args[1] || 30
const iterationDelay = Deno.args[2] || 20

const extract = ministres
  /* Instead of filtering the deleted accounts, we'll save the status of the account in the data.json file to store raw data, and potentially correct the source @ in députés-*
   */
  .filter(
    (d) =>
      !doneEntries.find(
        ([nom, { analyseDate: doneAnalyseDate }]) =>
          console.log(d, nom, analyseDate, doneAnalyseDate) ||
          (nom === d['Nom'] && doneAnalyseDate === analyseDate)
      )
  )
  .slice(0, limit)

console.log(extract)

const doFetch = async () => {
  const entries = await Promise.all(
    extract.map(async (politix, i) => {
      const { Nom: name, '@X': at } = politix

      const prenom = name.split(' ')[0]
      const nom = name.split(' ').slice(1).join(' ')
      const noTwitterAccount = !at || at === ''

      const [, values] = noTwitterAccount
        ? [, null]
        : await checkTwitterActivity(at, i)
      const result = await findBlueskyAccount({ nom, prenom }, i)
      const [{ bsky, avatar }, activity] = result
      logResult(result)

      const verifiedBsky =
        bsky && !bskyFalsePositives.includes(bsky) ? bsky : null
      return [
        name,
        {
          nom,
          prenom,
          analyseDate,
          x: noTwitterAccount ? false : at,
          bsky: verifiedBsky || null,
          deletedXAccount: values === '!exist',
          notFoundXAccount: !values,
          activité: { x: values, bsky: activity },
          avatar,
        },
      ]
    })
  )

  const o = Object.fromEntries(entries)

  Deno.writeTextFileSync(
    './ministres.json',
    JSON.stringify(
      {
        ...alreadyDone,
        ...o,
      },
      null,
      2
    )
  )
  return console.log("Voilà c'est analysé dans ./ministres.json")
}

const ws =
  'ws://127.0.0.1:1337/devtools/browser/e82185e6-f90d-4da1-9a67-0a8445f82b85'

const browser = await launch({
  wsEndpoint: ws,
  headless: false,
})

await delay(initialDelay * 1000)

const checkTwitterActivity = async (at, i) => {
  await delay(i * iterationDelay * 1000)
  if (!at.startsWith('@') && at.length < 2) {
    throw new Error('Problème dans le pseudo ' + at + '.')
  }

  const netAt = at.slice(1)
  console.log('Lancement du scraping pour ', netAt)

  //const url = 'https://xcancel.com/' + netAt
  const url = 'https://x.com/' + netAt
  //const url = 'https://nitter.poast.org/' + netAt
  //const url = 'https://cartes.app/blog'
  console.log('will' + url + ' ' + i)

  try {
    const page = await browser.newPage(url)
    await delay(3000)
    // Run code in the context of the browser
    // Run code in the context of the browser
    const values = await page.evaluate(() => {
      const html = document.body.innerHTML

      if (html.includes('This account doesn’t exist')) {
        return '!exist'
      }

      return Array.from(html.matchAll(/datetime="(\d\d\d\d-\d\d-\d\d)T/g)).map(
        (match) => match[1]
      )
    })

    console.log(values)
    if (values !== '!exist' && values.length < 2) {
      throw new Error(
        "Pas assez de tweets trouvés, c'est suspect ! Investiguer " + at
      )
    }

    return [at, values]
  } catch (e) {
    console.log('Erreur pour ' + at, e)
    return [at, false]
  }
}

doFetch()
