import {Button, Card} from "react-bootstrap";
import type {GetAllProductDto} from "../../../../data/product/product.type.ts";
import {Link} from "@tanstack/react-router";

interface Props {
  dto: GetAllProductDto
}

export default function ProductCard({dto}: Props) {
  return (
      <>
        <Card style={{width: '24rem'}} className="shadow-sm py-1">
          <div style={{
            backgroundImage: `url(${dto.imageUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            width: "100%",
            height: 240,
          }}>

          </div>
          {/*<Card.Img variant="top" src=  "https://project-image-bucket-2026.s3.ap-southeast-1.amazonaws.com/fresh_chicken.jpg"/>*/}
          <Card.Body>
            <Card.Title style={{height:"5rem"}}>{dto.name}</Card.Title>
            <Card.Text>
              ${dto.price.toLocaleString()}<br/>
              {dto.hasStock?"有貨!!":"售罄!!"}
            </Card.Text>
            <Link
            to={"/product/$productId"}
            params={{
              productId:dto.pid.toString(),
            }}
            >
              <Button variant="primary">資料</Button>

            </Link>
          </Card.Body>
        </Card>
      </>
  )
}
