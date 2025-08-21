import React from 'react'

const EMOJIS = ['👍','❤️','😂','🎉','😮','😢']

export const EmojiBar = ({ onPick }) => (
  <div className="emoji-bar">
    {EMOJIS.map(e => (
      <button key={e} className="emoji" onClick={() => onPick(e)}>{e}</button>
    ))}
  </div>
)


