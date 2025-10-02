import { ReactNode } from "react";

const Page = ({
  children
}: {
  children: ReactNode
}) => (
  <div className="page-wrapper">
    <div className="page">
      {children}
    </div>
  </div>
);

export default Page;
