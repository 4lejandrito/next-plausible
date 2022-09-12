export default function Clickable(props) {
  const className =
    props.className ?? 'text-primary-copy hover:underline inline-block'
  const title = `${
    props.href ? 'CTRL+click' : 'Click'
  } to see the analytcis event being sent`
  return props.href ? (
    <a className={className} href={props.href} target="_blank" title={title}>
      {props.children ?? props.href}
    </a>
  ) : (
    <button className={className} title={title} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
