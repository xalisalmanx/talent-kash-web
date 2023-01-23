//axios
import axios from "axios";

export default function SetDevKey(key) {
  if (key) {
    return (axios.defaults.headers.common["key"] = key);
  } else {
    return delete axios.defaults.headers.common["key"];
  }
}
