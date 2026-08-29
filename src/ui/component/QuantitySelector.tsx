import {Button, Spinner, Stack} from "react-bootstrap";

interface Props {
  quantity: number,
  handleQuantityMinusOne: () => void,
  handleQuantityPlusOne: () => void,
  stock: number,
  isLoading?: boolean
}

export default function QuantitySelector({
                                           quantity,
                                           handleQuantityMinusOne,
                                           handleQuantityPlusOne,
                                           stock,
                                           isLoading=false}: Props) {

  return (

      <Stack direction="horizontal">
        <Button
            variant={"light"}
            style={{height: 40, width: 40}}
            onClick={handleQuantityMinusOne}
            disabled={quantity <= 1||isLoading}
        >
          -
        </Button>
        <div style={{height: 40, width: 40}}
             className="d-flex align-items-center justify-content-center"
        >
          {isLoading?<Spinner size="sm" /> :quantity}
        </div>
        <Button
            variant={"light"}
            style={{height: 40, width: 40}}
            onClick={handleQuantityPlusOne}
            disabled={quantity >= stock||isLoading}>
          +
        </Button>

      </Stack>
  )
}