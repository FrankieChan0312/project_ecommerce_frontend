import {
  Badge,
  Button,
  Card
} from "react-bootstrap";

import {Link} from "@tanstack/react-router";

import type {
  GetAllProductDto
} from "../../../../data/product/product.type.ts";

import "./ProductCard.css";


interface Props {
  dto: GetAllProductDto;
  isFavorite: boolean;
  isFavoriteUpdating: boolean;
  onToggleFavorite: (pid: number) => Promise<void>;
}


export default function ProductCard({
                                      dto,
                                      isFavorite,
                                      isFavoriteUpdating,
                                      onToggleFavorite
                                    }: Props) {

  return (
      <Card className="product-card">

        <div className="product-card-image-container">

          <Link
              to="/product/$productId"
              params={{
                productId: dto.pid.toString()
              }}
          >
            <Card.Img
                src={dto.imageUrl}
                alt={dto.name}
                className="product-card-image"
            />
          </Link>

          <Button
              type="button"
              className="product-card-favorite"
              disabled={isFavoriteUpdating}
              aria-label={
                isFavorite
                    ? `取消收藏 ${dto.name}`
                    : `收藏 ${dto.name}`
              }
              title={
                isFavoriteUpdating
                    ? "更新中..."
                    : isFavorite
                        ? "從我的最愛移除"
                        : "加入我的最愛"
              }
              onClick={() => {
                void onToggleFavorite(dto.pid);
              }}
          >
            {isFavorite ? "♥" : "♡"}
          </Button>

        </div>


        <Card.Body className="product-card-body">

          {
              dto.categoryName &&

              <Badge className="product-card-category">
                {dto.categoryName}
              </Badge>
          }


          <div className="product-card-name">
            {dto.name}
          </div>


          <div className="product-card-origin">
            {
              dto.origin
                  ? dto.origin
                  : "產地資料未提供"
            }
          </div>


          <div className="product-card-price">
            HK${dto.price.toFixed(2)}
          </div>


          <div
              className={
                dto.hasStock
                    ? "product-card-stock in-stock"
                    : "product-card-stock out-of-stock"
              }
          >
            {
              dto.hasStock
                  ? "● 有貨"
                  : "● 暫時售罄"
            }
          </div>


          <Link
              to="/product/$productId"
              params={{
                productId: dto.pid.toString()
              }}
              className="product-card-detail-link"
          >
            <Button
                className="product-card-detail-button"
            >
              查看詳情
            </Button>
          </Link>

        </Card.Body>

      </Card>
  );
}