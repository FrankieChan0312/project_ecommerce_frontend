import {
  Container
} from "react-bootstrap";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "@tanstack/react-router";

import TopNavBar
  from "../../component/TopNavBar.tsx";


export default function ThankyouPage() {

  const navigate =
      useNavigate({
        from: "/thankyou/"
      });


  const [countDown, setCountDown] =
      useState(5);


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


    // Clear the previous timer when the effect reruns
    // or when the page is unmounted.
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

            {/* This page is shown only after the complete
                transaction flow has reached SUCCESS. */}
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