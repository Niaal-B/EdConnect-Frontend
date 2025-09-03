
// Mock data for demonstration - updated for study abroad context
export const mentorChats = [
  {
    id: 1,
    name: "Dr. Alex Johnson",
    status: "online",
    image: "/placeholder.svg",
    university: "Massachusetts Institute of Technology",
    lastMessage: "Make sure to highlight your research experience in your application.",
    unread: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    messages: [
      {
        id: 1,
        text: "Hello! I reviewed your university application draft. Your academic achievements are impressive, but I think we should strengthen your personal statement.",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
      {
        id: 2,
        text: "Thank you! I'm particularly concerned about my chances at MIT. Do you think I should emphasize my research experience more?",
        sender: "student" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
      },
      {
        id: 3,
        text: "Make sure to highlight your research experience in your application.",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      },
    ]
  },
  {
    id: 2,
    name: "Sarah Williams",
    status: "offline",
    image: "/placeholder.svg",
    university: "University of Oxford",
    lastMessage: "I can help you prepare for the Oxford interview next week.",
    unread: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messages: [
      {
        id: 1,
        text: "How is your Oxford application coming along?",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      },
      {
        id: 2,
        text: "I've submitted it! Now I'm nervous about the potential interview.",
        sender: "student" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 115), // 115 minutes ago
      },
      {
        id: 3,
        text: "I can help you prepare for the Oxford interview next week.",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
    ]
  },
  {
    id: 3,
    name: "Michael Chen",
    status: "online",
    image: "/placeholder.svg",
    university: "National University of Singapore",
    lastMessage: "The scholarship application deadline is next Friday, don't forget!",
    unread: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    messages: [
      {
        id: 1,
        text: "I've reviewed your scholarship application for NUS.",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      },
      {
        id: 2,
        text: "Great! Any suggestions for improvement?",
        sender: "student" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
      },
      {
        id: 3,
        text: "Your academic achievements are solid, but add more about your community involvement.",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
      },
      {
        id: 4,
        text: "The scholarship application deadline is next Friday, don't forget!",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
    ]
  },
];
