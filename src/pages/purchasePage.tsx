import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { CreditCard, Smartphone } from 'lucide-react';
import { purchaseCourse } from '../apis/purchase';
import { useAuth } from '../contexts/AuthContext';
import { fetchCourseById } from '../apis/course';
import { toast } from 'react-toastify';

interface CourseType {
  _id: string;
  title: string;
  tutor: string;
  price: number;
  image: string;
  description: string;
}

interface LocationState {
  course?: CourseType;
}

const PurchasePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeCourseId } = useParams<{ id: string }>();
  const { user, refreshUser } = useAuth();

  const [course, setCourse] = useState<CourseType | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user?.role === 'tutor') {
      navigate('/tutor-dashboard', { replace: true });
      return;
    }

    const state = location.state as LocationState;
    if (state?.course?._id) {
      setCourse(state.course);
      localStorage.setItem('selectedCourse', JSON.stringify(state.course));
    } else {
      const stored = localStorage.getItem('selectedCourse');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?._id) setCourse(parsed);
        } catch {}
      }
    }
  }, [location.state, user, navigate]);

  useEffect(() => {
    const loadCourse = async () => {
      if (!course && routeCourseId) {
        try {
          const c = await fetchCourseById(routeCourseId);
          const normalized: CourseType = {
            _id: c._id,
            title: c.title,
            tutor: typeof c.tutor === 'object' ? (c.tutor?.name ?? 'Tutor') : (c.tutor as string) || 'Tutor',
            price: c.price,
            image: c.imageUrl || (Array.isArray(c.imageUrls) ? c.imageUrls[0] : ''),
            description: c.description,
          };
          setCourse(normalized);
          localStorage.setItem('selectedCourse', JSON.stringify(normalized));
        } catch {}
      }
    };
    loadCourse();
  }, [course, routeCourseId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return navigate('/login');

    if (!course?._id) {
      localStorage.removeItem('selectedCourse');
      return navigate('/courses');
    }

    if (!selectedPayment) return toast.error('Please select a payment method.');

    if (!formData.name || !formData.email || !formData.phone) {
      return toast.error('Please fill all required fields.');
    }

    if (selectedPayment === 'card' && (!formData.cardNumber || !formData.expiryDate || !formData.cvv)) {
      return toast.error('Please fill all card details.');
    }

    setIsProcessing(true);

    try {
      const transactionId = `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      await purchaseCourse({
        courseId: course._id,
        paymentMethod: selectedPayment,
        transactionId,
        amount: course.price,
      });

      await refreshUser();
      localStorage.removeItem('selectedCourse');

      navigate('/payment-success', {
        state: {
          course,
          paymentMethod: selectedPayment,
          transactionId,
          amount: course.price,
        }
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Course Selected</h2>
          <button
            onClick={() => navigate('/courses')}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pay securely with EasyPaisa mobile account',
      color: 'bg-green-50 border-green-300'
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pay securely with JazzCash mobile wallet',
      color: 'bg-red-50 border-red-300'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Pay with Visa, Mastercard, or any debit card',
      color: 'bg-blue-50 border-blue-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/courses')}
          className="mb-6 flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold"
        >
          ← Back to Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-merienda">Course Details</h2>
            {course.image && (
              <img
                src={`${backendUrl}${course.image}`}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
            )}
            <h3 className="text-md font-bold text-gray-900 mb-2 font-playDEGrund">{course?.title}</h3>
            <p className="text-gray-600 mb-4 font-playDEGrund text-[12px]">by {course.tutor}</p>
            <p className="text-gray-700 mb-6 font-playDEGrund text-sm tracking-wide">{course.description}</p>

            <div className="border-t border-gray-200 pt-6 mt-auto font-merienda">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium">Course Price:</span>
                <span className="text-xl font-bold text-yellow-600">${course.price}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium">Processing Fee:</span>
                <span className="text-lg font-semibold text-gray-700">$0</span>
              </div>
              <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-yellow-600">${course.price}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col font-merienda">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>

            <form onSubmit={handlePurchase} className="space-y-6 flex flex-col flex-1">
              {/* Personal Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method *</label>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-yellow-600 bg-yellow-50 shadow-md'
                          : `${method.color} hover:shadow-md`
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="mt-1 w-5 h-5 text-yellow-600 focus:ring-yellow-500"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          {method.icon}
                          <span className="font-bold text-gray-900 text-lg">{method.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              {selectedPayment === 'card' && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Info for mobile payments */}
              {selectedPayment && selectedPayment !== 'card' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    After clicking "Complete Purchase", you will be redirected to complete the payment via {selectedPayment === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'}.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedPayment || isProcessing}
                className="w-full bg-yellow-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-yellow-700 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Complete Purchase - $${course.price}`}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
