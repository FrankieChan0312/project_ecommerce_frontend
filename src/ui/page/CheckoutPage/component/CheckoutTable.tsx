import {
  Table
} from "react-bootstrap";

import CheckoutTableRow from "./CheckoutTableRow.tsx";

import type {
  TransactionDto
} from "../../../../data/transaction/transaction.type.ts";


interface Props {
  transactionDto: TransactionDto;
}


export default function CheckoutTable({
                                        transactionDto
                                      }: Props) {

  return (
      <Table className="align-middle">

        <thead>

        <tr>
          <th></th>
          <th>商品名稱</th>
          <th>單價</th>
          <th>數量</th>
          <th>小計</th>
        </tr>

        </thead>


        <tbody>

        {
          // Transaction items are snapshots created when checkout begins.
          // They preserve the purchase-time product information and price.
          transactionDto.items.map(
              (item) => (

                  <CheckoutTableRow
                      key={item.tpid}
                      item={item}
                  />

              )
          )
        }

        </tbody>

      </Table>
  );
}