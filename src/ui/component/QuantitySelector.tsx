import {Button, Stack} from "react-bootstrap";

interface Props {
  quantity: number,
  handleQuantityMinusOne: () => void,
  handleQuantityPlusOne: () => void,
  stock: number
}

export default function QuantitySelector({quantity, handleQuantityMinusOne, handleQuantityPlusOne, stock}: Props) {
  return (

      <Stack direction="horizontal">
        <Button
            variant={"light"}
            style={{height: 40, width: 40}}
            onClick={handleQuantityMinusOne}
            disabled={quantity <= 1}>
          -
        </Button>
        <div style={{height: 40, width: 40}}
             className="d-flex align-items-center justify-content-center"
        >
          {quantity}
        </div>
        <Button
            variant={"light"}
            style={{height: 40, width: 40}}
            onClick={handleQuantityPlusOne}
              disabled={quantity >= stock}>
          +
        </Button>

      </Stack>
  )
}