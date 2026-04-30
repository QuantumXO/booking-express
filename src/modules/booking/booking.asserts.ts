import { User, UserRoles } from '../users/users.types';
import { Booking } from './booking.models';
import { ApiError } from '../../utils/api-error';
import { BookingStatuses } from './booking.types';
import { isAdmin, isContractor } from '../users/users.helpers';

export function assertCanCancelBooking(actor: User, booking: Booking): void {
  const isBookingOwner = booking.userId === actor.id;
  const isBookingContractor = booking.contractorId === actor.id;

  if (isAdmin(actor)) return;
  if (isContractor(actor) && isBookingContractor) return;
  if (isBookingOwner) return;

  throw ApiError.forbidden('You cannot cancel this booking');
}

export function assertBookingCanBeCancelled(booking: Booking): void {
  if (booking.status === BookingStatuses.CANCELLED) {
    throw ApiError.conflict('Booking is already cancelled');
  }
  if (booking.status === BookingStatuses.COMPLETED) {
    throw ApiError.conflict('Completed booking cannot be cancelled');
  }
}
