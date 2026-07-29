
// Mock data for demonstration
export const mentorChats = [
  {
    id: 1,
    name: "Dr. Alex Johnson",
    status: "online",
    image: "/placeholder.svg",
    university: "Software Engineering",
    lastMessage: "Make sure to explain your project structure clearly in the presentation.",
    unread: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    messages: [
      {
        id: 1,
        text: "Hello! I reviewed your project outline. Your idea is strong, but I think we should make the problem statement clearer.",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
      {
        id: 2,
        text: "Thank you! I am concerned about explaining the technical workflow. Should I add a short architecture diagram?",
        sender: "student" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
      },
      {
        id: 3,
        text: "Make sure to explain your project structure clearly in the presentation.",
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
    university: "Data Analytics",
    lastMessage: "I can help you prepare the demo flow for next week.",
    unread: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messages: [
      {
        id: 1,
        text: "How is your dashboard demo coming along?",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      },
      {
        id: 2,
        text: "The main screens are ready, but I am nervous about explaining the data flow.",
        sender: "student" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 115), // 115 minutes ago
      },
      {
        id: 3,
        text: "I can help you prepare the demo flow for next week.",
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
    university: "Product Design",
    lastMessage: "Your LearnAI notes page is a strong feature to highlight.",
    unread: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    messages: [
      {
        id: 1,
        text: "I reviewed your LearnAI feature notes.",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      },
      {
        id: 2,
        text: "Great! Any suggestions for the presentation?",
        sender: "student" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
      },
      {
        id: 3,
        text: "Start with the student problem, then show how the YouTube summarizer solves it.",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
      },
      {
        id: 4,
        text: "Your LearnAI notes page is a strong feature to highlight.",
        sender: "mentor" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
    ]
  },
];
