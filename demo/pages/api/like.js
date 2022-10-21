export default async function likeHandler(_, res) {
  res.send({
    likes: process.env.PLAUSIBLE_API_KEY
      ? await fetch(
          'https://plausible.io/api/v1/stats/breakdown?site_id=next-plausible.vercel.app&property=event:name&metrics=events&filters=event:name==Like&period=12mo',
          {
            headers: {
              Authorization: `Bearer ${process.env.PLAUSIBLE_API_KEY}`,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => data.results?.[0]?.events ?? 0)
      : 0,
  })
}
