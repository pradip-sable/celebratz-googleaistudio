import { useApp } from '../context/AppContext';
import { Enquiry } from '../types';

export function useCustomerEnquiries(customerId?: string) {
  const { enquiries, currentUser, createEnquiry } = useApp();
  const targetId = customerId || currentUser.id;
  const customerEnquiries = enquiries.filter(e => e.customerId === targetId);

  return {
    enquiries: customerEnquiries,
    count: customerEnquiries.length,
    createEnquiry
  };
}

export function useVendorEnquiries(vendorId?: string) {
  const { enquiries, currentUser, updateEnquiryStatus } = useApp();
  const targetId = vendorId || currentUser.id;
  const vendorEnquiries = enquiries.filter(e => e.vendorId === targetId);

  const pendingEnquiries = vendorEnquiries.filter(e => e.vendorStatus === 'pending');
  const acceptedEnquiries = vendorEnquiries.filter(e => e.vendorStatus === 'accepted');
  const declinedEnquiries = vendorEnquiries.filter(e => e.vendorStatus === 'declined');

  return {
    enquiries: vendorEnquiries,
    pending: pendingEnquiries,
    accepted: acceptedEnquiries,
    declined: declinedEnquiries,
    totalCount: vendorEnquiries.length,
    pendingCount: pendingEnquiries.length,
    updateEnquiryStatus
  };
}
