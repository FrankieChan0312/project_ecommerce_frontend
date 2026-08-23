import TopNavBar from "../../component/TopNavBar.tsx";

export default function ErrorPage() {
  return (
      <>
        <TopNavBar/>
        <div className="d-flex justify-content-center align-items-center "
        style={{
          height: "90vh",
        }}>
          <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOL-J0yuPCBrz5B81--TYzlB_KP5mroTfidb_azSD77A&s=10"
              width={720}
              alt="error"

          />
        </div>
      </>
  )
}