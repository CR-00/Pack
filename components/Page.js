import { useRouter } from "next/router";
import Layout from "./Layout";

export default function Page({ children }) {
  // Hide the layout if we're at /login.
  const router = useRouter();
  const renderLayout = !router.pathname.includes("/auth/");
  return (
    <div>{renderLayout ? <Layout>{children}</Layout> : <>{children}</>}</div>
  );
}
