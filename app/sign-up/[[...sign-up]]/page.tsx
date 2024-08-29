import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mt-20 w-screen flex justify-center">
      <SignUp />
    </div>
  );
}
