import axios from "axios";

import type {
  TransactionDto
} from "../data/transaction/transaction.type.ts";


import {
  getAuthConfig
} from "../authService/firebaseAuthService.ts";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// All transaction endpoints require Firebase authentication.
// getAuthConfig() attaches the current user's Bearer token
// to each request.
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


export async function processTransaction(
    tid: string
) {

  // Start payment processing by moving the transaction
  // from PREPARE to PROCESSING.
  //
  // The backend responds with HTTP 204 No Content because
  // this request only changes the transaction status.
  const response =
      await axios.patch<TransactionDto>(
          `${baseUrl}/transactions/${tid}/payment`,
          null,
          await getAuthConfig()
      );

  return response.data;
}


export async function finishTransaction(
    tid: string
) {

  // Complete a PROCESSING transaction.
  // The backend re-checks and deducts stock, changes the status
  // to SUCCESS and clears the authenticated user's cart.
  const response =
      await axios.patch<TransactionDto>(
          `${baseUrl}/transactions/${tid}/success`,
          null,
          await getAuthConfig()
      );

  return response.data;
}