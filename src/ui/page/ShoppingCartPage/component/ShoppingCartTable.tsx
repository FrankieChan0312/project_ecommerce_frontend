import {
  Table
} from "react-bootstrap";

import ShoppingCartTableRow from "./ShoppingCartTableRow.tsx";

import type {
  CartItemDto
} from "../../../../data/cartItem/cartItem.type.ts";


interface Props {
  cartItemDtoList: CartItemDto[];

  handleQuantityChange: (
      pid: number,
      quantity: number
  ) => void;

  handleDelete: (
      pid: number
  ) => void;
}


export default function ShoppingCartTable({
                                            cartItemDtoList,
                                            handleQuantityChange,
                                            handleDelete
                                          }: Props) {

  return (
      <Table
          responsive
          hover
          className="align-middle mb-0"
      >

        <thead>

        <tr>
          <th>商品</th>
          <th>名稱</th>
          <th>單價</th>
          <th>數量</th>
          <th>小計</th>
          <th></th>
        </tr>

        </thead>


        <tbody>

        {
          // Each row manages its own quantity/delete API request.
          // Successful changes are then reported back to the parent
          // so the cart summary and navbar badge can be updated.
          cartItemDtoList.map(
              (dto) => (

                  <ShoppingCartTableRow
                      key={dto.pid}
                      dto={dto}
                      handleQuantityChange={
                        handleQuantityChange
                      }
                      handleDelete={
                        handleDelete
                      }
                  />

              )
          )
        }

        </tbody>

      </Table>
  );
}