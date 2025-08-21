import React, { useState } from 'react'

export const CommentThread = ({ postId, comments, onReact, onAddComment, depth = 0 }) => {
  const [newText, setNewText] = useState('')

  function handleAdd() {
    const text = newText.trim()
    if (!text) return
    onAddComment?.({ postId, parentId: null, text })
    setNewText('')
  }

  return (
    <div className="comments">
      <div className="comments__create">
        <input
          className="input"
          placeholder="Write a comment..."
          value={newText}
          onChange={e => setNewText(e.target.value)}
        />
        <button className="button" onClick={handleAdd}>Comment</button>
      </div>
      <ul className="comments__list">
        {comments.map(comment => (
          <li key={comment.id} className="comment">
            <CommentItem
              postId={postId}
              comment={comment}
              onReact={onReact}
              onAddComment={onAddComment}
              depth={depth}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

const CommentItem = ({ postId, comment, onReact, onAddComment, depth }) => {
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  function handleReact(emoji) {
    onReact?.({ postId, commentId: comment.id, reaction: emoji })
  }

  function handleAddReply() {
    const text = replyText.trim()
    if (!text) return
    onAddComment?.({ postId, parentId: comment.id, text })
    setReplyText('')
    setIsReplying(false)
  }

  return (
    <div className="comment__item" style={{ marginLeft: depth * 16 }}>
      <div className="comment__header">
        <div className="avatar small">{comment.author?.initials || 'U'}</div>
        <div className="comment__meta">
          <span className="comment__author">{comment.author?.name || 'User'}</span>
          <span className="comment__time">{timeAgo(comment.createdAt)}</span>
        </div>
      </div>
      <div className="comment__body">{comment.text}</div>
      <div className="comment__actions">
        <button className="icon-btn" onClick={() => handleReact('like')}>👍 {comment.likes ?? 0}</button>
        <button className="icon-btn" onClick={() => setIsReplying(v => !v)}>Reply</button>
        <EmojiBar onPick={handleReact} />
      </div>
      {isReplying && (
        <div className="comments__create" style={{ marginTop: 8 }}>
          <input
            className="input"
            placeholder="Reply..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
          />
          <button className="button" onClick={handleAddReply}>Reply</button>
        </div>
      )}
      {comment.children && comment.children.length > 0 && (
        <ul className="comments__list">
          {comment.children.map(child => (
            <li key={child.id} className="comment">
              <CommentItem
                postId={postId}
                comment={child}
                onReact={onReact}
                onAddComment={onAddComment}
                depth={Math.min(depth + 1, 6)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const EMOJIS = ['👍','❤️','😂','🎉','😮','😢']

const EmojiBar = ({ onPick }) => (
  <div className="emoji-bar">
    {EMOJIS.map(e => (
      <button key={e} className="emoji" onClick={() => onPick(e)}>{e}</button>
    ))}
  </div>
)

function timeAgo(ts) {
  const diff = Math.max(0, Date.now() - ts)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}


