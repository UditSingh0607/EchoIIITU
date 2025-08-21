export const mockPosts = [
  {
    id: 'p1',
    type: 'event',
    author: { name: 'Dr. Sharma', dept: 'CSE Dept', initials: 'DS' },
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    title: 'Docker Workshop',
    body: 'Join us for an exciting workshop on Docker containerization. Learn the basics and hands-on implementation.',
    event: {
      dateText: 'Fri, 22 Aug, 5:00 pm',
      locationText: 'CSE Lab',
      rsvpCounts: { going: 23, interested: 45, cantGo: 2 },
      userRsvp: null
    },
    reactions: { likes: 15, shares: 12, comments: 8 },
    comments: [
      {
        id: 'c1',
        author: { name: 'Aarav', initials: 'AR' },
        createdAt: Date.now() - 1000 * 60 * 30,
        text: 'Will the session cover Docker Compose as well?',
        likes: 3,
        children: [
          {
            id: 'c1-1',
            author: { name: 'Dr. Sharma', initials: 'DS' },
            createdAt: Date.now() - 1000 * 60 * 20,
            text: 'Yes, we will briefly introduce Compose with a demo.',
            likes: 7,
            children: [
              {
                id: 'c1-1-1',
                author: { name: 'Neha', initials: 'N' },
                createdAt: Date.now() - 1000 * 60 * 10,
                text: 'Awesome! Looking forward to it.',
                likes: 2,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 'c2',
        author: { name: 'Ravi', initials: 'R' },
        createdAt: Date.now() - 1000 * 60 * 15,
        text: 'Can non-CSE students join?',
        likes: 1,
        children: []
      }
    ]
  },
  {
    id: 'p2',
    type: 'lostFound',
    author: { name: 'Priya', dept: 'ECE Dept', initials: 'P' },
    createdAt: Date.now() - 1000 * 60 * 120,
    title: 'Lost black wallet near library',
    body: 'Has a silver stripe and student ID. Please DM if found.',
    reactions: { likes: 8, shares: 1, comments: 6 },
    comments: [
      {
        id: 'c3',
        author: { name: 'Vikram', initials: 'V' },
        createdAt: Date.now() - 1000 * 60 * 90,
        text: 'I saw a similar wallet at the reading room desk.',
        likes: 4,
        children: []
      }
    ]
  },
  {
    id: 'p3',
    type: 'announcement',
    author: { name: 'Admin', dept: 'Exam Cell', initials: 'EC' },
    createdAt: Date.now() - 1000 * 60 * 240,
    title: 'Midterm Timetable',
    body: 'The timetable PDF has been uploaded to the portal. Please check and report clashes by Friday.',
    reactions: { likes: 12, shares: 3, comments: 2 },
    comments: []
  }
]


