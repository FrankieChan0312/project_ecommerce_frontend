import type {
  TransactionProduct
} from "../../../../data/transaction/transaction.type.ts";


interface Props {
  item: TransactionProduct;
}


export default function CheckoutTableRow({
                                           item
                                         }: Props) {

  return (
      <tr>

        <td>

          <img
              src={item.product.imageUrl}
              alt={item.product.name}
              height="120"
          />

        </td>


        <td>
          {item.product.name}
        </td>


        <td>
          HK$
          {
            item.product.price
                .toLocaleString()
          }
        </td>


        <td>
          {item.quantity}
        </td>


        <td>
          HK$
          {
            item.subtotal
                .toLocaleString()
          }
        </td>

      </tr>
  );
}