import {
  Container
} from "react-bootstrap";

import TopNavBar
  from "../../component/TopNavBar.tsx";


export default function ErrorPage() {

  return (
      <>
        <TopNavBar
            showSearch={false}
        />


        <Container>

          {/* Common fallback page for unexpected frontend or API failures.
              Business-specific validation errors should normally be handled
              on the page where they occur instead of redirecting here. */}
          <div
              className="
                d-flex
                flex-column
                justify-content-center
                align-items-center
                text-center
              "
              style={{
                minHeight: "80vh"
              }}
          >

            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOL-J0yuPCBrz5B81--TYzlB_KP5mroTfidb_azSD77A&s=10"
                width={720}
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }}
                alt="An unexpected error occurred"
            />


            <h2 className="mt-4">
              發生了一些問題
            </h2>


            <p className="text-muted">
              請稍後再試，或返回主頁重新操作。
            </p>

          </div>

        </Container>
      </>
  );
}