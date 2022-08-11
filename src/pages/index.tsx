import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useForm } from "react-hook-form";
import { useSession, signOut, getSession } from "next-auth/react";

interface newUserForm {
  email: string;
  password: string;
  username: string;
}

const Home: NextPage = () => {
  const { mutateAsync } = trpc.useMutation("users.register-user");

  const { register, handleSubmit } = useForm<newUserForm>();

  const { data: session } = useSession();

  const onSubmit = handleSubmit((data) => {
    mutateAsync({
      email: data.email,
      password: data.password,
      username: data.username,
    });
    console.log(data);
  });

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br></br>
        <button onClick={() => signOut()} className="rounded-sm bg-red-700">
          Sign out
        </button>
      </>
    );
  }

  return (
    <div className="flex">
      <h1>You're not signed in, So Sign in now!</h1>
      <form
        onSubmit={onSubmit}
        className="bg-slate-500 mx-auto m-20 p-10 rounded-md"
      >
        <input
          {...register("email")}
          placeholder="rayfaelang@gmail.com"
          className="bg-transparent outline-none"
        />
        <input
          {...register("username")}
          placeholder="mas"
          className="bg-transparent outline-none"
        />
        <input
          {...register("password")}
          type="password"
          className="bg-transparent outline-none"
        />
        <button className="bg-slate-800 rounded-sm p-3">button</button>
      </form>
    </div>
  );
};

export default Home;
