import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { AdminService, client } from "./client";

function App() {
  const testCallApi = async () => {
    const { data, error } = await AdminService.adminAdminUpdateAdmin({
      client,
      headers: {
        "x-token": "fake-super-secret-token",
      },
    });
    if (error) {
      alert(error);
      return;
    }
    alert(`message from backend: ${data.message}`);
  };

  return (
    <>
      <div>
        <button onClick={() => testCallApi()}>test button</button>
      </div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
    </>
  );
}

export default App;
