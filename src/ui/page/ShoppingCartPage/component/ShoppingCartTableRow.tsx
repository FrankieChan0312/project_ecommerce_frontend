import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import QuantitySelector from "../../../component/QuantitySelector.tsx";
import type {CartItemDto} from "../../../../data/cartItem/cartItem.type.ts";

interface Props {
  dto:CartItemDto
}

export default function ShoppingCartTableRow({dto}:Props) {
  return (
      <tr>
        <td>
          <img
              height="120"
              src={dto.imageUrl}
              alt="product photo"/>
        </td>
        <td>
          {dto.name}
        </td>
        <td>
          {dto.price.toLocaleString()}
        </td>
        <td>
          <QuantitySelector
          quantity={dto.cartQuantity}
          handleQuantityMinusOne={()=>{}}
          handleQuantityPlusOne={()=>{}}
          stock={dto.stock}/>

          </td>
        <td>${(dto.price*dto.cartQuantity).toLocaleString()}</td>
        <td>
          <Button variant="danger">
            <FontAwesomeIcon icon={faTrash}/>
          </Button>

        </td>
      </tr>
  )
}


//
// {
//   "categoryId": 1,
//     "categoryName": "肉類",
//     "hasStock": true,
//     "imageUrl": "https://project-image-bucket-2026.s3.ap-southeast-1.amazonaws.com/fresh_chicken.jpg",
//     "name": "法蘭西冰鮮黃油雞",
//     "origin": "法國布列塔尼 (Brittany, France)",
//     "pid": 1,
//     "price": 129.00
// },