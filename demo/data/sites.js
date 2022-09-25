const rp = require('request-promise-native')
const { load } = require('cheerio')
const { graphql } = require('@octokit/graphql')
require('dotenv-flow').config()

async function getRepo(repo) {
  const [owner, name] = repo.split('/')
  const data = await graphql(
    `
      query ($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          homepageUrl
          stargazerCount
        }
      }
    `,
    {
      owner,
      name,
      headers: {
        authorization: `token ${process.env.GITHUB_PAT}`,
      },
    }
  )
  return {
    url: data.repository.homepageUrl,
    stars: data.repository.stargazerCount,
  }
}

async function getDependents(repo) {
  async function fetchDependents(uri) {
    const results = await rp({ uri: uri })
    const $ = load(results)
    const dependents = $('#dependents a[data-hovercard-type="repository"]')
      .toArray()
      .map((a) => a.attribs.href.substring(1))
    const nextUrl = $('.paginate-container a')
      .filter(function () {
        return $(this).text() === 'Next' && $(this).attr('href')
      })
      .map(function () {
        return $(this).attr('href')
      })
      .toArray()[0]

    if (nextUrl) {
      return [...dependents, ...$(await fetchDependents(nextUrl))]
    }
    return dependents
  }
  return await fetchDependents(`https://github.com/${repo}/network/dependents`)
}

async function getDependentSites(repo) {
  return (
    await Promise.all(
      (
        await getDependents(repo)
      ).map(async (repo) => {
        const { url, stars } = await getRepo(repo)
        return {
          url,
          stars,
        }
      })
    )
  )
    .sort((a, b) => (a.stars < b.stars ? 1 : -1))
    .filter((site) => site.url && site.url.startsWith('http'))
    .filter((_, i) => i < 50)
    .map((site) => site.url.replace(/\/+$/, ''))
}

;(async () =>
  console.log(
    JSON.stringify(await getDependentSites('4lejandrito/next-plausible'))
  ))()
