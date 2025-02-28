import NavbarUnLogin from "../../components/Navbar/NavbarUnLogin";

function SignUp() {
  return (
    <>
      <NavbarUnLogin>
       
      <ul className="flex space-x-4 items-center">
         
          <p>Already have an account?</p>
          <li>
            <a
              href="#"
            className=" text-white  relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white"
            >
              Sin In
            </a>
          </li>
          
       </ul>
      
       
        
      </NavbarUnLogin>
      <div className="mr-0 ml-0 mt-[10vh] flex flex-col justify-start items-start h-[400px] w-[500px] bg-[#D5C6E0] rounded-2xl p-6">
        {/* <div className="bg-[#192A51] px-3 py-2 mb-4 rounded-2xl    border-transparent border-white border-2 ">
          <p className=" text-white text-xl ">Sign Up with Email</p>
        </div> */}
        <p className=" text-[#192A51] text-white text-2xl pb-4">
          Sign Up with Email
        </p>
        <p className="text-white text-xl mb-4">Email</p>
        <input
          type="text"
          placeholder="Enter text..."
          className="w-[100%] mb-4 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-white text-xl pb-4">Password</p>
        <input
          type="text"
          placeholder="Enter text..."
          className="w-[100%] mb-4 p-2  rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="bg-[#192A51] w-[100%] text-white mt-4 px-20 py-2 rounded-lg hover:border-white border-2   hover:text-blue-400 transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}

export default SignUp;
