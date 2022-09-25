import Clickable from './Clickable'
import Marquee from 'react-fast-marquee'
import sites from '../data/sites.json'

export default function Usages() {
  return (
    <div className="w-full text-sm text-copy-muted mb-2">
      <div className="mb-1 px-4">
        Happily{' '}
        <Clickable href="https://github.com/4lejandrito/next-plausible/network/dependents">
          used by
        </Clickable>
      </div>
      <div className="h-8">
        <Marquee gradient={false} pauseOnHover delay={1} className="px-1">
          {sites.map((url, i) => (
            <span
              key={i}
              className="mx-1 rounded h-8 px-2 bg-background-light text-inverse-copy inline-flex gap-2 items-center"
            >
              <img
                className="w-4 h-4 rounded-full"
                src={`https://s2.googleusercontent.com/s2/favicons?domain=${url}&sz=128`}
              />
              <Clickable href={url}>
                {url.replace(/http[s]*:\/\//, '').replace(/www\./, '')}
              </Clickable>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
