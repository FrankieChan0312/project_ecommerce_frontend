import {
  Button,
  Container
} from "react-bootstrap";

import CheckoutTable
  from "./component/CheckoutTable.tsx";

import {
  useNavigate,
  useParams
} from "@tanstack/react-router";

import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  LoginUserContext
} from "../../../context/LoginUserContext.tsx";

import type {
  TransactionDto
} from "../../../data/transaction/transaction.type.ts";

import LoadingContainer
  from "../../component/LoadingContainer.tsx";

import TopNavBar
  from "../../component/TopNavBar.tsx";

import {
  createStripeCheckout,
  getTransaction
} from "../../../api/transactionApi.ts";

import "./CheckoutPage.css";


export default function CheckoutPage() {

  const navigate =
      useNavigate({
        from: "/checkout/$tid"
      });


  const {tid} =
      useParams({
        from: "/checkout/$tid"
      });


  const loginUser =
      useContext(LoginUserContext);


  const [
    transactionDto,
    setTransactionDto
  ] =
      useState<TransactionDto | undefined>(
          undefined
      );


  const [isLoading, setIsLoading] =
      useState(true);


  const [isCheckout, setIsCheckout] =
      useState(false);


  // =========================
  // Load transaction
  // =========================

  useEffect(() => {

    const fetchTransaction =
        async () => {

          try {

            if (loginUser) {

              // Load the transaction using both the transaction ID
              // and the authenticated Firebase user.
              const responseData =
                  await getTransaction(
                      tid
                  );

              setTransactionDto(
                  responseData
              );

            } else if (
                loginUser === null
            ) {

              // Redirect only after Firebase has confirmed
              // that no user is currently authenticated.
              void navigate({
                to: "/login"
              });
            }

          } catch {

            void navigate({
              to: "/error"
            });

          } finally {

            setIsLoading(false);
          }
        };


    void fetchTransaction();

  }, [
    loginUser,
    tid,
    navigate
  ]);


  // =========================
  // Stripe Checkout
  // =========================

  const handleCheckout =
      async () => {

        setIsCheckout(true);


        try {

          // The backend creates the Stripe Checkout Session
          // using the transaction snapshot stored in MySQL.
          //
          // The browser never sends or controls the payment amount.
          const stripeCheckout =
              await createStripeCheckout(
                  tid
              );


          // Leave Frankie’s Grocery temporarily and open
          // Stripe's hosted payment page.
          //
          // Stripe will redirect the customer back to the
          // configured success or cancel URL afterwards.
          window.location.assign(
              stripeCheckout.checkoutUrl
          );

        } catch {

          setIsCheckout(false);


          void navigate({
            to: "/error"
          });
        }
      };


  // =========================
  // Price calculation
  // =========================

  const calSubtotal = (
      dto: TransactionDto
  ) => {

    // Each item subtotal was calculated by the backend
    // from its transaction snapshot price and quantity.
    return dto.items.reduce(
        (total, item) =>
            total + item.subtotal,
        0
    );
  };


  const calShippingFee = (
      dto: TransactionDto
  ) => {

    // The backend transaction total already includes delivery.
    //
    // shipping fee =
    // transaction total - merchandise subtotal
    return dto.total
        - calSubtotal(dto);
  };


  const subtotal =
      transactionDto
          ? calSubtotal(transactionDto)
          : 0;


  const shippingFee =
      transactionDto
          ? calShippingFee(transactionDto)
          : 0;


  return (
      <>
        <TopNavBar
            showSearch={false}
        />


        <main className="checkout-page">

          <Container>

            <div className="checkout-header">

              <h1 className="checkout-title">
                結賬
              </h1>


              <p className="checkout-subtitle">
                請確認商品及金額後完成付款
              </p>

            </div>


            {
              transactionDto &&
              !isLoading
                  ? (

                      <div className="checkout-layout">


                        <section className="checkout-table-section">

                          <div className="checkout-section-heading">

                            <h2>
                              訂單商品
                            </h2>


                            <span>
                              {
                                transactionDto
                                    .items
                                    .length
                              } 件商品
                            </span>

                          </div>


                          <CheckoutTable
                              transactionDto={
                                transactionDto
                              }
                          />

                        </section>


                        <aside className="checkout-summary">

                          <h3 className="checkout-summary-title">
                            賬單總覽
                          </h3>


                          <div className="checkout-summary-row">

                            <span>
                              商品總額
                            </span>


                            <span>
                              HK$
                              {
                                subtotal
                                    .toLocaleString()
                              }
                            </span>

                          </div>


                          <div className="checkout-summary-row">

                            <span>
                              運費
                            </span>


                            <span
                                className={
                                  shippingFee === 0
                                      ? "checkout-free-shipping"
                                      : ""
                                }
                            >

                              {
                                shippingFee === 0
                                    ? "免費"
                                    : `HK$${shippingFee.toLocaleString()}`
                              }

                            </span>

                          </div>


                          <div className="checkout-shipping-note">
                            滿 HK$500 免費送貨
                          </div>


                          <hr/>


                          <div className="checkout-total">

                            <span>
                              Total
                            </span>


                            <span>
                              HK$
                              {
                                transactionDto
                                    .total
                                    .toLocaleString()
                              }
                            </span>

                          </div>


                          <Button
                              className="checkout-pay-button"
                              onClick={() => {
                                void handleCheckout();
                              }}
                              disabled={
                                isCheckout
                              }
                          >

                            {
                              isCheckout
                                  ? "正在前往 Stripe..."
                                  : "使用 Stripe 付款"
                            }

                          </Button>


                          <p className="checkout-secure-text">
                            付款將透過 Stripe 安全處理
                          </p>

                        </aside>

                      </div>

                  )

                  : (

                      <div className="checkout-loading">

                        <LoadingContainer/>

                      </div>

                  )
            }

          </Container>

        </main>
      </>
  );
}