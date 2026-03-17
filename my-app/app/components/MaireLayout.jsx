import Sidebar2 from "./Sidebar2";
export default function MaireLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Sidebar2 />

      {/*
        Desktop: push content right by sidebar width (ml-60)
        Mobile:  push content down by mobile header height (pt-16)
      */}
      <main className="md:ml-60  bg-gray-100   pt-16 md:pt-0 flex-1 p-6 md:p-8  flex justify-center items-center  min-h-screen">
        {children}
      </main>
    </div>
  );
}