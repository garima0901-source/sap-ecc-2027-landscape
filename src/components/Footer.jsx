import data from '../data/landscape.json'

export default function Footer() {
  return (
    <footer className="bg-ink">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="border-t border-hairline pt-10">
          <p className="text-sm text-paper-dim">
            Built independently by{' '}
            <span className="text-paper font-medium">Garima</span> — an official work sample for
            a content growth journalist role, not an official content product.
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
