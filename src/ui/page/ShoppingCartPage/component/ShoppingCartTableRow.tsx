import {
  useState
} from "react";

import {
  Button
} from "react-bootstrap";

import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";

import {
  faTrash
} from "@fortawesome/free-solid-svg-icons";

import QuantitySelector from "../../../component/QuantitySelector.tsx";

import type {
  CartItemDto
} from "../../../../data/cartItem/cartItem.type.ts";

import {
  deleteCartItem,
  patchCartItem
} from "../../../../api/cartItemApi.ts";


interface Props {
  dto: CartItemDto;

  handleQuantityChange: (
      pid: number,
      quantity: number
  ) => void;

  handleDelete: (
      pid: number
  ) => void;
}


export default function ShoppingCartTableRow({
                                               dto,
                                               handleQuantityChange,
                                               handleDelete
                                             }: Props) {

  const [isLoading, setIsLoading] =
      useState(false);


  // =========================
  // Decrease quantity
  // =========================

  const handleMinus =
      async () => {

        // Cart quantity cannot be reduced below one.
        // Removing the product completely is handled
        // by the delete button instead.
        if (dto.cartQuantity <= 1) {
          return;
        }


        setIsLoading(true);


        try {

          const newQuantity =
              dto.cartQuantity - 1;


          // PATCH replaces the existing cart quantity
          // with the new final quantity.
          await patchCartItem(
              dto.pid,
              newQuantity
          );


          // Update the parent page only after
          // the backend request succeeds.
          handleQuantityChange(
              dto.pid,
              newQuantity
          );

        } catch (error) {

          console.error(
              "Failed to decrease cart quantity:",
              error
          );

        } finally {

          // Always restore the controls even when
          // the API request fails.
          setIsLoading(false);
        }
      };


  // =========================
  // Increase quantity
  // =========================

  const handlePlus =
      async () => {

        // Prevent the frontend from requesting more units
        // than the latest stock value it has received.
        if (
            dto.cartQuantity >= dto.stock
        ) {

          return;
        }


        setIsLoading(true);


        try {

          const newQuantity =
              dto.cartQuantity + 1;


          await patchCartItem(
              dto.pid,
              newQuantity
          );


          handleQuantityChange(
              dto.pid,
              newQuantity
          );

        } catch (error) {

          console.error(
              "Failed to increase cart quantity:",
              error
          );

        } finally {

          setIsLoading(false);
        }
      };


  // =========================
  // Delete item
  // =========================

  const handleDeleteButton =
      async () => {

        setIsLoading(true);


        try {

          // Delete the cart item from the backend first.
          // The row is removed from the local UI only
          // after the backend confirms success.
          await deleteCartItem(
              dto.pid
          );


          handleDelete(
              dto.pid
          );

        } catch (error) {

          console.error(
              "Failed to delete cart item:",
              error
          );

        } finally {

          // Prevent the row from remaining permanently disabled
          // if the delete request fails.
          setIsLoading(false);
        }
      };


  return (
      <tr>

        <td>

          <img
              height="120"
              src={dto.imageUrl}
              alt={dto.name}
          />

        </td>


        <td>
          {dto.name}
        </td>


        <td>
          HK${dto.price.toLocaleString()}
        </td>


        <td>

          <QuantitySelector
              quantity={
                dto.cartQuantity
              }
              handleQuantityMinusOne={() => {
                void handleMinus();
              }}
              handleQuantityPlusOne={() => {
                void handlePlus();
              }}
              isLoading={
                isLoading
              }
              stock={
                dto.stock
              }
          />

        </td>


        <td>
          HK$
          {
            (
                dto.price
                * dto.cartQuantity
            ).toLocaleString()
          }
        </td>


        <td>

          <Button
              variant="danger"
              onClick={() => {
                void handleDeleteButton();
              }}
              disabled={
                isLoading
              }
          >

            <FontAwesomeIcon
                icon={faTrash}
            />

          </Button>

        </td>

      </tr>
  );
}