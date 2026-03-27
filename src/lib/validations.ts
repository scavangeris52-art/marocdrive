/**
 * Zod validation schemas for API endpoints
 */

import { z } from 'zod'

// =============================================
// BOOKING VALIDATION
// =============================================
export const createBookingSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Téléphone invalide'),
  pickupDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Date de prise en charge invalide'),
  returnDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Date de retour invalide'),
  pickupCity: z.string().min(1, 'Ville obligatoire'),
  carId: z.coerce.number().positive('ID véhicule invalide'),
  notes: z.string().optional().default(''),
  lang: z.enum(['en', 'fr', 'ar', 'es']).optional().default('fr'),
}).refine(
  (data) => new Date(data.pickupDate) < new Date(data.returnDate),
  {
    message: 'La date de retour doit être après la date de prise en charge',
    path: ['returnDate'],
  }
).refine(
  (data) => new Date(data.pickupDate) >= new Date(),
  {
    message: 'La date de prise en charge ne peut pas être dans le passé',
    path: ['pickupDate'],
  }
)

// =============================================
// CONTACT MESSAGE VALIDATION
// =============================================
export const createContactMessageSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional().default(''),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(5000, 'Le message ne doit pas dépasser 5000 caractères'),
})

// =============================================
// CAR VALIDATION
// =============================================
export const createCarSchema = z.object({
  brand: z.string().min(1, 'Marque obligatoire'),
  model: z.string().min(1, 'Modèle obligatoire'),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive('Le prix doit être positif'),
  category: z.enum(['economy', 'compact', 'sedan', 'suv', 'luxury']),
  transmission: z.enum(['manual', 'automatic']),
  fuel: z.enum(['petrol', 'diesel', 'hybrid', 'electric']),
  seats: z.coerce.number().min(1).max(8).optional().default(5),
  ac: z.boolean().optional().default(true),
  status: z.enum(['available', 'unavailable']).optional().default('available'),
  image: z.string().url('URL de l\'image invalide'),
  descEn: z.string().optional().default(''),
  descFr: z.string().optional().default(''),
  descAr: z.string().optional().default(''),
  descEs: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
})

export const updateCarSchema = createCarSchema.partial()

// =============================================
// ADMIN OPERATIONS
// =============================================
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Le mot de passe actuel est obligatoire'),
  newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
}).refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: 'Le nouveau mot de passe doit être différent du mot de passe actuel',
    path: ['newPassword'],
  }
)

// =============================================
// TESTIMONIAL VALIDATION
// =============================================
export const testimonialSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  text: z.string().min(10, 'Le témoignage doit contenir au moins 10 caractères').max(500, 'Le témoignage ne doit pas dépasser 500 caractères'),
  rating: z.number().min(1).max(5).optional().default(5),
})
