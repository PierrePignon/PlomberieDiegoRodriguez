import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBar from "./MobileBar";
import SchemaOrg from "../seo/SchemaOrg";

export default function Layout() {
  return (
    <>
      <SchemaOrg />
      <Navbar />
      <main className="pt-16 lg:pt-20 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
