import axios from "axios";

import type {
  TransactionDto
} from "../data/transaction/transaction.type.ts";

import {
  getAuthConfig
} from "../authService/firebaseAuthService.ts";


const baseUrl =
    import.meta.env.VITE_API_BASE_URL;


export interface StripeCheckoutResponse {
  checkoutUrl: string;
}


// =========================
// Stripe Checkout
// =========================

export async function createStripeCheckout(
    tid: string
) {

  // Ask the backend to create a Stripe-hosted Checkout Session.
  //
  // The frontend sends only the transaction ID.
  // Product prices, quantities and the final amount are determined
  // by the backend transaction snapshot.
  const response =
      await axios.post<StripeCheckoutResponse>(
          `${baseUrl}/transactions/${tid}/stripe-checkout`,
          null,
          await getAuthConfig()
      );

  return response.data;
}


// =========================
// Transaction
// =========================

// All transaction endpoints require Firebase authentication.
// getAuthConfig() attaches the current user's Bearer token
// to each protected request.
export async function getTransaction(
    tid: string
) {

  // Retrieve a transaction that belongs to the authenticated user.
  // The backend validates both the transaction ID and buyer identity.
  const response =
      await axios.get<TransactionDto>(
          `${baseUrl}/transactions/${tid}`,
          await getAuthConfig()
      );

  return response.data;
}


export async function postTransaction() {

  // Create a transaction from the user's current cart.
  // The backend stores product snapshots and creates
  // the transaction in PREPARE status.
  const response =
      await axios.post<TransactionDto>(
          `${baseUrl}/transactions`,
          null,
          await getAuthConfig()
      );

  return response.data;
}