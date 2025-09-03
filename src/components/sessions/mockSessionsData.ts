
import { Session } from "./SessionsProvider";

// Helper function to create dates (past, future, today)
const createDate = (dayOffset: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date;
};

export const mockSessions: Session[] = [
  {
    id: "1",
    mentorId: "m1",
    mentorName: "Dr. Sarah Johnson",
    mentorTitle: "Computer Science Professor at Stanford",
    mentorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    date: createDate(2), // 2 days in future
    time: "10:00 AM",
    duration: "60 minutes",
    status: "upcoming",
    topic: "Applying to US Graduate Programs"
  },
  {
    id: "2",
    mentorId: "m2",
    mentorName: "Michael Chen",
    mentorTitle: "International Student Advisor at MIT",
    mentorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    date: createDate(5), // 5 days in future
    time: "3:30 PM",
    duration: "45 minutes",
    status: "upcoming",
    topic: "Scholarship Opportunities"
  },
  {
    id: "3",
    mentorId: "m3",
    mentorName: "Emma Wilson",
    mentorTitle: "Study Abroad Specialist",
    mentorImage: "https://randomuser.me/api/portraits/women/68.jpg",
    date: createDate(-7), // 7 days in past
    time: "2:00 PM",
    duration: "60 minutes",
    status: "completed",
    topic: "UK University Culture",
    notes: "Provided great insights on UK university application timeline"
  },
  {
    id: "4",
    mentorId: "m4",
    mentorName: "James Rodriguez",
    mentorTitle: "International Admissions Officer",
    mentorImage: "https://randomuser.me/api/portraits/men/67.jpg",
    date: createDate(-3), // 3 days in past
    time: "11:15 AM",
    duration: "30 minutes",
    status: "canceled",
    topic: "Financial Planning for Students"
  },
  {
    id: "5",
    mentorId: "m5",
    mentorName: "Aisha Patel",
    mentorTitle: "PhD Student at Oxford",
    mentorImage: "https://randomuser.me/api/portraits/women/91.jpg",
    date: createDate(-14), // 14 days in past
    time: "4:45 PM",
    duration: "45 minutes",
    status: "completed",
    topic: "Research Opportunities Abroad",
    notes: "Discussed summer research programs and application strategies"
  },
  {
    id: "6",
    mentorId: "m6",
    mentorName: "Daniel Kim",
    mentorTitle: "International Student Success Coach",
    mentorImage: "https://randomuser.me/api/portraits/men/42.jpg",
    date: createDate(7), // 7 days in future
    time: "1:00 PM",
    duration: "60 minutes",
    status: "upcoming",
    topic: "Adapting to New Academic Systems"
  }
];
