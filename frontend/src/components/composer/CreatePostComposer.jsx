import React, { useMemo, useState } from 'react'

export const CreatePostComposer = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('')
  const [attachment, setAttachment] = useState(null)
  const isDisabled = useMemo(() => prompt.trim().length === 0, [prompt])

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null
    setAttachment(file)
  }

  function handleSubmit() {
    onSubmit?.({ prompt, attachment })
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


