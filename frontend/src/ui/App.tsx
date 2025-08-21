import React, { useMemo, useState } from 'react'

type TabKey = 'create' | 'lostFound' | 'events' | 'announcements'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'create', label: 'Create Post' },
  { key: 'lostFound', label: 'Lost & Found' },
  { key: 'events', label: 'Events' },
  { key: 'announcements', label: 'Announcements' }
]

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('create')

  return (
    <div className="app">
      <header className="app__header">
        <h1>IIIT-Una Feed</h1>
      </header>
      <nav className="tabs" role="tablist" aria-label="Main sections">
        {TABS.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={activeTab === tab.key ? 'tab tab--active' : 'tab'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="content">
        {activeTab === 'create' && <CreatePostSection />}
        {activeTab === 'lostFound' && <EmptyList label="Lost & Found" />}
        {activeTab === 'events' && <EmptyList label="Events" />}
        {activeTab === 'announcements' && <EmptyList label="Announcements" />}
      </main>
    </div>
  )
}

const EmptyList: React.FC<{ label: string }> = ({ label }) => (
  <section className="panel">
    <div className="empty">
      <p>No {label} posts yet.</p>
    </div>
  </section>
)

const CreatePostSection: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const isDisabled = useMemo(() => prompt.trim().length === 0, [prompt])

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null
    setAttachment(file)
  }

  function handleSubmit() {
    // In next steps, call backend to classify and build preview
    // For now, just log
    // eslint-disable-next-line no-console
    console.log('Submit prompt', { prompt, attachmentName: attachment?.name })
    alert('Prompt submitted for processing. (Wire-up backend next)')
  }

  return (
    <section className="panel">
      <label htmlFor="prompt" className="label">Create a post</label>
      <div className="composer">
        <textarea
          id="prompt"
          className="input"
          placeholder="Describe your post... (e.g., Lost my black wallet near the library)"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
        />
        <div className="composer__actions">
          <input id="file" type="file" className="file" onChange={handleFileChange} />
          <button className="button" disabled={isDisabled} onClick={handleSubmit}>Send</button>
        </div>
      </div>
      <p className="hint">
        The system will classify your prompt into Lost & Found, Event, or Announcement and show an editable preview before posting.
      </p>
    </section>
  )
}


