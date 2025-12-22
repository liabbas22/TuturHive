const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface PurchaseRequest {
  courseId: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
}

export interface PurchaseResponse {
  message: string;
  course: any;
  purchasedCourses: any[];
}

export const purchaseCourse = async (purchaseData: PurchaseRequest): Promise<PurchaseResponse> => {
  console.log('Purchase request data:', purchaseData);
  
  const response = await fetch(`${API_BASE_URL}/api/auth/student/purchase-course`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(purchaseData),
  });

  console.log('Purchase response status:', response.status);
  console.log('Purchase response ok:', response.ok);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    console.error('Purchase error:', errorData);
    throw new Error(errorData.message || 'Purchase failed');
  }

  const result = await response.json();
  console.log('Purchase success:', result);
  return result;
};
