export interface Course {
  id: string;
  title: string;
  description: string;
  tutor: string;
  price: number;
  category: string;
  image: string;
  driveLink?: string;
}

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced React Development',
    description: 'Master React with hooks, context, and advanced patterns',
    tutor: 'Sarah Johnson',
    price: 99,
    category: 'Programming',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Data Science Fundamentals',
    description: 'Learn Python, statistics, and machine learning basics',
    tutor: 'Dr. Michael Chen',
    price: 149,
    category: 'Data Science',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Digital Marketing Strategy',
    description: 'Complete guide to modern digital marketing techniques',
    tutor: 'Emma Rodriguez',
    price: 79,
    category: 'Marketing',
    image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'
  },
  {
    id: '4',
    title: 'UI/UX Design Principles',
    description: 'Create beautiful and functional user interfaces',
    tutor: 'Alex Thompson',
    price: 89,
    category: 'Design',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'
  },
  {
    id: '5',
    title: 'Financial Planning Basics',
    description: 'Learn personal finance and investment strategies',
    tutor: 'Robert Davis',
    price: 69,
    category: 'Finance',
    image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'
  },
  {
    id: '6',
    title: 'Creative Writing Workshop',
    description: 'Develop your writing skills and find your voice',
    tutor: 'Lisa Martinez',
    price: 59,
    category: 'Writing',
    image: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'
  }
];