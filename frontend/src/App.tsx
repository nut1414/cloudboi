import "./App.css";
// import Nav from "./components/Nav";
import NavbarUnLogin from "./components/NavbarUnLogin";

function App() {
  return (
    <>
      <NavbarUnLogin>
        <ul className="flex space-x-4 items-center">
          <li>
            <a
              href="#"
              className="bg-[#967AA1] text-white px-4 py-2 rounded-2xl   hover:text-black"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="bg-[#967AA1] text-white px-4 py-2 rounded-2xl   hover:text-black"
            >
              About us
            </a>
          </li>
          <li>
            <a
              href="#"
              className="bg-[#967AA1] text-white px-4 py-2 rounded-2xl   hover:text-black"
            >
              Pricing
            </a>
          </li>
          <li>
            <a
              href="#"
              className="bg-[#967AA1] text-white px-4 py-2 rounded-2xl   hover:text-black"
            >
              Use cases
            </a>
          </li>
          <li>
            <a
              href="#"
              className="bg-[#967AA1] text-white ml-40 px-4 py-2  rounded-2xl  border-transparent border-white border-2   hover:text-black "
            >
              Sign In
            </a>
          </li>
        </ul>
      </NavbarUnLogin>

      {/* Large Square Content */}
      <div className="mr-0 ml-0 mt-[10vh] flex justify-center items-center h-[500px] w-[1200px] bg-[#D5C6E0] rounded-2xl">
        <div>
          <h1 className="text-white pb-5 font-bold"> Your Cloud, Your Way </h1>
          <p className="text-white text-2xl w-[1000px] p-4">
            {" "}
            Deploy Bare Metal and Virtual Machines with Ease.
          </p>
          <p className="text-white text-2xl w-[1000px] pb-9">
            With our cloud solution, unlock powerful infrastructure management,
            whether you're managing virtual machines, containers, or networking
            for your projects. Our platform, built with Metal as a Service
            (MAAS), gives you robust and flexible tools to deploy, monitor, and
            scale your resources—all from a single interface.
          </p>
          <ul>
            <li>
              <a
                href="#"
                className="bg-[#967AA1] text-white px-4 py-2 rounded-2xl  border-transparent hover:border-white border-2   hover:text-black "
              >
                Sign up with email
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
