//axios
import axios from "axios";

export default function SetToken(key) {
  if (key) return (axios.defaults.headers.common["Authorization"] = key);
  else return delete axios.defaults.headers.common["Authorization"];
}
