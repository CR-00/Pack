import { useRouter } from "next/router";
import Layout from "./Layout";

export default function Page({ children }) {
  const router = useRouter();
  const renderLayout = !router.pathname.includes("/auth/");
  return (
    <div>{renderLayout ? <Layout>{children}</Layout> : <>{children}</>}</div>
  );
}
