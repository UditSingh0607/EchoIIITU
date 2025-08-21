import React, { useMemo, useState } from 'react'
import { Tabs } from '../components/common/Tabs'
import { CreatePostComposer } from '../components/composer/CreatePostComposer'
import { PostCard } from '../components/feed/PostCard'
import { mockPosts } from '../data/mockPosts'

const TABS = [
  { key: 'create', label: 'Create Post' },
  { key: 'lostFound', label: 'Lost & Found' },
  { key: 'events', label: 'Events' },
  { key: 'announcements', label: 'Announcements' }
]

export const MainPage = () => {
  const [activeTab, setActiveTab] = useState('create')
  const [posts, setPosts] = useState(mockPosts)

  const filtered = useMemo(() => {
    if (activeTab === 'create') return []
    if (activeTab === 'lostFound') return posts.filter(p => p.type === 'lostFound')
    if (activeTab === 'events') return posts.filter(p => p.type === 'event')
    if (activeTab === 'announcements') return posts.filter(p => p.type === 'announcement')
    return posts
  }, [activeTab, posts])

  function handleSubmit({ prompt, attachment }) {
    // Replace with API call to backend for classification
    // eslint-disable-next-line no-console
    console.log('Submit prompt', { prompt, attachmentName: attachment?.name })
    alert('Prompt submitted for processing. (Wire-up backend next)')
  }

  return (
    <>
      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />
      <main className="content">
        {activeTab === 'create' && <CreatePostComposer onSubmit={handleSubmit} />}
        {activeTab !== 'create' && (
          filtered.length === 0 ? (
            <EmptyList label={TABS.find(t => t.key === activeTab)?.label} />
          ) : (
            <div className="feed">
              {filtered.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onRSVP={(id, status) => console.log('RSVP', id, status)}
                  onReact={(id, reaction) => console.log('React post', id, reaction)}
                  onCommentReact={({ postId, commentId, reaction }) => console.log('React comment', postId, commentId, reaction)}
                  onAddComment={({ postId, parentId, text }) => console.log('Add comment', postId, parentId, text)}
                />
              ))}
            </div>
          )
        )}
      </main>
    </>
  )
}

const EmptyList = ({ label }) => (
  <section className="panel">
    <div className="empty">
      <p>No {label} posts yet.</p>
    </div>
  </section>
)


