import TopNavBar from "../../component/TopNavBar.tsx";
import {Container} from "react-bootstrap";
import ProductCardContainer from "./component/ProductCardContainer.tsx";

export default function ProductListingPage() {
  return (
      <>
        <TopNavBar/>
        <Container>
          <ProductCardContainer/>
        </Container>
      </>
  )
}