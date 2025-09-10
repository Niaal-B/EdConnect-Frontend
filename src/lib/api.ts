import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getRedirectUrl = (currentPath: string): string => {
  // Admin routes
  if (currentPath.startsWith('/admin')) {
    return '/admin/login';
  }
  
  // Mentor routes
  if (currentPath.startsWith('/mentor')) {
    return '/mentor/register';
  }
  
  // Student routes
  if (currentPath.startsWith('/student/')) {
    return '/student/login';
  }
  
  // Default fallback
  return '/login';
};

api.interceptors.request.use(request => {
  return request;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await api.post("/auth/token/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        const currentPath = window.location.pathname;
        
        const authPages = [
          '/admin/login',
          '/mentor/register', 
          '/mentor/login',
          '/student/login',
          '/student/register',  
          '/login'
        ];
        
        if (!authPages.includes(currentPath)) {
          const redirectUrl = getRedirectUrl(currentPath);
          console.log('Redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);



export const logout = async () => {
  return await api.post("user/logout/");
};

export const updateUserStatus = async (userId: number, isActive: boolean) => {
  try {
    const response = await api.patch(
      `admin/users/${userId}/status/`,
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const getPendingVerifications = async () => {
  const response = await api.get(
    `admin/mentors/pending/`,
    { withCredentials: true }
  );
  return response.data;
};

export const getRejectedMentors = async () => {
  const response = await api.get(
    `admin/mentors/rejected/`,
    { withCredentials: true }
  );
  return response.data;
};


export const approveMentor = async (mentorId: string) => {
  const response = await api.patch(
    `admin/mentors/${mentorId}/approve-reject/`,
    { action: 'approve' },
    { withCredentials: true }
  );
  return response.data;
};

export const rejectMentor = async (mentorId: string, reason?: string) => {
  console.log(reason,"This is the reason")
  const response = await api.patch(
    `admin/mentors/${mentorId}/approve-reject/`,
    { action:'reject', reason },
    { withCredentials: true }
  );
  return response.data;
};

export interface MentorApplication {
  id: string;
  email: string;
  bio: string;
  phone: string;
  expertise: string[];
  experience_years: number;
  is_verified: boolean;
  verification_status: 'pending' | 'under_review' | 'approved' | 'rejected';
  rejection_reason: string | null;
  profile_picture: string | null;
  documents: {
    id: string;
    document_type: string;
    file: string;
    uploaded_at: string;
    is_approved: boolean;
  }[];
  last_status_update: string;
}

// Mentor-specific API methods
export const mentorApi = {
  // Get profile (JSON)
  getProfile: () => api.get("mentors/profile/"),

  // Update profile (JSON)
  updateProfile: (data: {
    bio: string;
    phone: string;
    expertise: Record<string, string>;
    experience_years: number;
  }) => api.patch("mentors/profile/", data),

  updateProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    return api.patch<{ profile_picture: string }>("mentors/profile/picture/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  uploadDocuments: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));  
    return api.post<{ document: { id: number, file: string, document_type: string } }>(
      "mentors/documents/", 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  }
};

export interface Mentor {
  id: number;
  username: string;
  bio: string;
  expertise: string[];
  countries: string;
  courses: string;
  experience_years: number;
  educations: Education[];
  is_verified: boolean;
  profile_picture: string | null;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  start_year: number;
  end_year: number | null;
  is_current: boolean;
}

export interface MentorApiResponse {
  success: boolean;
  mentors: Mentor[];
  total: number;
  count: number;
  page: number;
  results: Mentor[];
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
}

export interface MentorSearchParams {
  page?: number;
  expertise?: string;
  experience_min?: number;
  experience_max?: number;
  search?: string;
}

export const discoverMentorApi = {
  async getMentors(params: MentorSearchParams): Promise<MentorApiResponse> {
    try {
      // Clean up parameters - remove empty strings and undefined values
      const cleanParams: Record<string, any> = {};
      
      if (params.page && params.page > 0) {
        cleanParams.page = params.page;
      }
      
      if (params.expertise && params.expertise.trim()) {
        cleanParams.expertise = params.expertise.trim();
      }
      
      if (params.experience_min && params.experience_min > 0) {
        cleanParams.experience_min = params.experience_min;
      }
      
      if (params.experience_max && params.experience_max > 0) {
        cleanParams.experience_max = params.experience_max;
      }
      
      if (params.search && params.search.trim()) {
        cleanParams.search = params.search.trim();
      }

      console.log('API Request params:', cleanParams);

      const response = await api.get<MentorApiResponse>(
        `/mentors/mentors/public/`,
        { params: cleanParams }
      );

      console.log('API Response:', response.data);

      // Handle both response formats (new format with success/mentors/total and old format with results/count)
      if (response.data.success !== undefined) {
        // New format from backend
        return {
          success: response.data.success,
          mentors: response.data.mentors || [],
          total: response.data.total || 0,
          page: response.data.page || 1,
          count: response.data.total || 0,
          // ✅ Add these four lines:
          has_next: response.data.has_next || false,
          has_previous: response.data.has_previous || false,
          next_page: response.data.next_page ?? null,
          previous_page: response.data.previous_page ?? null
        };
      } else {
        // Fallback to old format
        return {
          success: true,
          mentors: response.data.results || [],
          total: response.data.count || 0,
          page: params.page || 1,
          count: response.data.count || 0,
          results: response.data.results || [],
          next: response.data.next,
          previous: response.data.previous
        };
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      
      // Return a proper error response
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      
      throw error;
    }
  }
};

//student side apis
interface StudentProfile {
  id: number;
  user: {
    id: number;
    username : string;
    email: string;
  };
  education_level: string;
  fields_of_interest: string[];
  preferred_countries: string[];
  interested_universities: string[];
  mentorship_preferences: string[];
  profile_picture?: string;
}

export const getStudentProfile = async (): Promise<StudentProfile> => {
  const response = await api.get(
    `students/profile/`,
    { withCredentials: true }
  );
  return response.data;
};

export const updateStudentProfile = async (data: Partial<StudentProfile>) => {
  const { user, profile_picture,...profileData } = data;
  console.log(profileData)
  const response = await api.patch(
    `students/profile/`,
    profileData,
    { withCredentials: true }
  );
  return response.data;
};

export const uploadProfilePicture = async (formData: FormData) => {
  const response = await api.patch(
    `students/profile/`,
    formData,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export default api;