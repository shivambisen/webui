/*
 * Copyright contributors to the Galasa project
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const HomePage = () => {
  const isLoggedIn = cookies().has("id_token");
  if (!isLoggedIn) {
    return redirect("/auth");
  }

  return (
    <div>
      <p>Galasa Ecosystem (Experimental)</p>
    </div>
  )
};

export default HomePage;