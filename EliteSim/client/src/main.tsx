import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { staticGameApi } from "./lib/static-game-api";

const networkFetch = window.fetch.bind(window);
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const localResponse = await staticGameApi(input, init);
  return localResponse ?? networkFetch(input, init);
};

createRoot(document.getElementById("root")!).render(<App />);
