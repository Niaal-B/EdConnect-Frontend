
import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import MentorSlotCreation from '@/components/mentors/MentorSlotCreation';

const MentorSlots = () => {
  return (
    <MentorDashboardLayout>
      <div className="p-6">
        <MentorSlotCreation />
      </div>
    </MentorDashboardLayout>
  );
};

export default MentorSlots;
