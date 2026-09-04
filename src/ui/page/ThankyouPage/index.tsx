import {
  Container
} from "react-bootstrap";

import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "@tanstack/react-router";

import TopNavBar
  from "../../component/TopNavBar.tsx";

import {
  CartContext
} from "../../../context/CartContext.tsx";


export default function ThankyouPage() {

  const navigate =
      useNavigate({
        from: "/thankyou/"
      });


  const cartContext =
      useContext(CartContext);


  if (!cartContext) {
    throw new Error(
        "ThankyouPage must be used inside CartContext provider"
    );
  }


  const {
    refreshCartItemCount
  } = cartContext;


  const [countDown, setCountDown] =
      useState(5);


  // =========================
  // Synchronize cart badge
  // =========================

  useEffect(() => {

    // Stripe redirects the browser separately from the webhook.
    // The Thank You page can therefore load slightly before the
    // backend has finished clearing the cart.
    //
    // Refresh immediately and then once per second while this page
    // remains visible so the navbar badge reaches zero shortly after
    // the webhook completes.
    void refreshCartItemCount();


    const intervalId =
        window.setInterval(
            () => {

              void refreshCartItemCount();

            },
            1000
        );


    return () => {

      window.clearInterval(
          intervalId
      );
    };

  }, [
    refreshCartItemCount
  ]);


  // =========================
  // Automatic redirect
  // =========================

  useEffect(() => {

    // Return to the homepage when the countdown finishes.
    if (countDown <= 0) {

      void navigate({
        to: "/"
      });

      return;
    }


    // Update the countdown once per second.
    const timeoutId =
        window.setTimeout(
            () => {

              setCountDown(
                  (prevState) =>
                      prevState - 1
              );

            },
            1000
        );


    return () => {

      window.clearTimeout(
          timeoutId
      );
    };

  }, [
    countDown,
    navigate
  ]);


  return (
      <>
        <TopNavBar
            showSearch={false}
        />


        <Container>

          <div
              style={{
                height: "80vh"
              }}
              className="
                d-flex
                flex-column
                align-items-center
                justify-content-center
              "
          >

            {/* Stripe has redirected the customer after payment.
                The backend webhook completes the authoritative
                transaction and cart cleanup independently. */}
            <img
                src="https://media.giphy.com/media/l3q2umc327t2nzSOQ/source.gif"
                alt="Thank you for your order"
            />


            <h2>
              感謝你的訂單！
            </h2>


            <h4>
              在 {countDown} 秒後回到主頁
            </h4>

          </div>

        </Container>
      </>
  );
}