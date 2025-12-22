import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';

type SuccessCourse = {
  _id?: string;
  id?: string;
  title: string;
  tutor: string;
  price: number;
  image: string;
  description: string;
};

interface LocationState {
  course: SuccessCourse;
  paymentMethod: string;
  transactionId: string;
  amount: number;
}

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { course, paymentMethod, transactionId, amount } = (location.state as LocationState) || {};
const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Payment Information</h2>
          <button
            onClick={() => navigate('/courses')}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const getPaymentMethodName = (method: string) => {
    const methods: { [key: string]: string } = {
      easypaisa: 'EasyPaisa',
      jazzcash: 'JazzCash',
      card: 'Credit/Debit Card'
    };
    return methods[method] || method;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-full p-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Payment Successful!</h1>
            <p className="text-green-100 text-lg font-outfit tracking-wider">
              Your course enrollment is confirmed
            </p>
          </div>

          <div className="p-8">
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`${backendUrl}${course.image}`}
                  alt={course.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{course.title}</h2>
                  <p className="text-gray-600">by {course.tutor}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Transaction ID</span>
                <span className="font-mono text-sm font-semibold text-gray-900">{transactionId}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Payment Method</span>
                <span className="font-semibold text-gray-900">{getPaymentMethodName(paymentMethod)}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Amount Paid</span>
                <span className="text-2xl font-bold text-green-600">${amount || course.price}</span>
              </div>

              <div className="flex justify-between py-3">
                <span className="text-gray-600 font-medium">Purchase Date</span>
                <span className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-blue-900 mb-1">What's Next?</h3>
                  <p className="text-sm text-blue-800">
                    A confirmation email with course access details has been sent to your email address.
                    You can start learning right away from your student dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/student-dashboard')}
                className="w-full bg-yellow-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-yellow-700 transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => window.print()}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>

              <button
                onClick={() => navigate('/courses')}
                className="w-full text-yellow-600 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-all"
              >
                Browse More Courses
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact our support team at{' '}
                <a href="mailto:support@example.com" className="text-yellow-600 hover:text-yellow-700 font-semibold">
                  support@example.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Thank you for choosing our platform for your learning journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
