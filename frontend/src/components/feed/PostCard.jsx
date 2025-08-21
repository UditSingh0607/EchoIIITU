import React, { useState } from 'react'
import { CommentThread } from './comments/CommentThread'

const TYPE_BADGE = {
  event: { label: 'Event', color: '#0f9d58' },
  lostFound: { label: 'Lost & Found', color: '#db4437' },
  announcement: { label: 'Announcement', color: '#4285f4' }
}

export const PostCard = ({ post, onRSVP, onReact, onCommentReact, onAddComment }) => {
  const [userRsvp, setUserRsvp] = useState(post.event?.userRsvp || null)

  function handleRsvp(status) {
    setUserRsvp(status)
    onRSVP?.(post.id, status)
  }

  return (
    <article className="post-card panel">
      <header className="post-card__header">
        <div className="avatar">{post.author?.initials || 'U'}</div>
        <div className="meta">
          <div className="author">{post.author?.name} <span className="dept">({post.author?.dept})</span></div>
          <div className="time">{timeAgo(post.createdAt)}</div>
        </div>
        <span className="badge" style={{ background: TYPE_BADGE[post.type]?.color }}>
          {TYPE_BADGE[post.type]?.label}
        </span>
      </header>

      <h3 className="post-card__title">{post.title}</h3>
      <p className="post-card__body">{post.body}</p>

      {post.type === 'event' && (
        <div className="event-bar">
          <div className="event-meta">
            <span className="pill">{post.event?.dateText}</span>
            <span className="pill">{post.event?.locationText}</span>
          </div>
          <div className="rsvp">
            <button className={userRsvp === 'going' ? 'pill pill--active' : 'pill'} onClick={() => handleRsvp('going')}>Going ({post.event?.rsvpCounts.going})</button>
            <button className={userRsvp === 'interested' ? 'pill pill--active' : 'pill'} onClick={() => handleRsvp('interested')}>Interested ({post.event?.rsvpCounts.interested})</button>
            <button className={userRsvp === 'cantGo' ? 'pill pill--active' : 'pill'} onClick={() => handleRsvp('cantGo')}>Can't Go ({post.event?.rsvpCounts.cantGo})</button>
          </div>
        </div>
      )}

      <footer className="post-card__footer">
        <button className="icon-btn" onClick={() => onReact?.(post.id, 'like')}>❤ {post.reactions?.likes ?? 0}</button>
        <button className="icon-btn">💬 {post.reactions?.comments ?? 0}</button>
        <button className="icon-btn">🔁 {post.reactions?.shares ?? 0}</button>
      </footer>

      <CommentThread
        postId={post.id}
        comments={post.comments || []}
        onReact={onCommentReact}
        onAddComment={onAddComment}
      />
    </article>
  )
}

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


