import { useSelector } from "react-redux";
import Button from "./Button";
import CreateUser from "../features/user/CreateUser";

function Home() {
  const username = useSelector((state) => state.user.username);

  return (
    <div className="my-10 px-4 text-center sm:my-16">
      <h1 className="mb-8  text-xl font-semibold md:text-3xl ">
        Car Rental
        <br />
        <span className="text-yellow-500">Rent the Best conditioned Cars.</span>
      </h1>

      {username === "" ? (
        <CreateUser />
      ) : (
        <Button to="/menu" type="primary">
          Continue ordering, {username}
        </Button>
      )}
    </div>
  );
}

export default Home;
