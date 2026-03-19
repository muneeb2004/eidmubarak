'use client'

interface LetterProps {
  recipientName: string
  message: string
  senderName?: string
}

export function Letter({ recipientName, message, senderName = 'Eid Mubarak' }: LetterProps) {
  return (
    <main className="w-full max-w-[600px] bg-white rounded-xl shadow-glow p-8 md:p-12 animate-slide-up-fade relative overflow-hidden">
      {/* Decorative subtle background elements inside the card */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full min-h-[300px] justify-between">
        {/* Recipient Header */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
            To {recipientName},
          </h1>
        </header>

        {/* Message Body */}
        <article className="flex-grow mb-10">
          <p className="text-lg text-text-main leading-[1.6] whitespace-pre-wrap">
            {message}
          </p>
        </article>

        {/* Sender Footer */}
        <footer className="text-right mt-auto">
          <p className="text-xl text-text-muted font-medium italic">
            Warmly, <br />
            <span className="text-text-main font-semibold not-italic text-lg">
              {senderName}
            </span>
          </p>
        </footer>
      </div>
    </main>
  )
}
