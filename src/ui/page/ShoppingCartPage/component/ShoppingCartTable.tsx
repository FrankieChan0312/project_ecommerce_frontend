import {Table} from "react-bootstrap";
import ShoppingCartTableRow from "./ShoppingCartTableRow.tsx";
import type {CartItemDto} from "../../../../data/cartItem/cartItem.type.ts";

interface Props{
  cartItemDtoList:CartItemDto[];
}

export default function ShoppingCartTable({cartItemDtoList}: Props) {
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
          cartItemDtoList.map((dto) => (
                  <ShoppingCartTableRow
                      key={dto.pid}
                  dto={dto}
                  />
              )
          )
        }
        </tbody>
      </Table>
  )
}