import React from 'react'

export const Tabs = ({ tabs, activeKey, onChange }) => {
  return (
    <nav className="tabs" role="tablist" aria-label="Main sections">
      {tabs.map(tab => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeKey === tab.key}
          className={activeKey === tab.key ? 'tab tab--active' : 'tab'}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}


