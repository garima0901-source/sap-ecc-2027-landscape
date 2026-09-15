import data from '../data/landscape.json'

export default function Footer() {
  return (
    <footer className="bg-ink">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="border-t border-hairline pt-10">
          <p className="text-paper-dim max-w-2xl leading-relaxed mb-2">
            Every number on this page is sourced and dated — see citations throughout. Data is
            checked weekly, not scraped live, because that's the honest way to keep a page like
            this accurate rather than just appearing to be real-time.
          </p>
          <p className="text-paper-faint text-sm mb-6">
            Last verified {data.meta.lastVerified}.
          </p>
          <p className="text-sm text-paper-dim">
            Built independently by{' '}
            <span className="text-paper font-medium">Garima</span> — a public work sample for
            Conduct's Brand &amp; Marketing role, not an official Conduct product.
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            {data.meta.githubUrl && (
              <a
                href={data.meta.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper-faint hover:text-amber underline decoration-dotted underline-offset-2 transition-colors"
              >
                GitHub ↗
              </a>
            )}
            {data.meta.linkedinUrl && (
              <a
                href={data.meta.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper-faint hover:text-amber underline decoration-dotted underline-offset-2 transition-colors"
              >
                LinkedIn ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
