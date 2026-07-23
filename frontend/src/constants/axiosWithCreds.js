//Esta classe vai ser usada quando se vai aceder paginas onde sera preciso credenciais de utilizador
//(nas que nao e preciso tal, pode-se continuar a usar a classe de defeito do Axios)
import axios from "axios";

const apiWithCreds = axios.create({
    baseURL: "import.meta.env.VITE_API_URL",
    withCredentials: true
});

export default apiWithCreds;