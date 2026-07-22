import {create} from "zustand";

//Em vez de importar a informacao do tema corrente de componente para componente, esta variavel fica guardada de forma global e utilizavel por qualquer componente (melhora escalabilidade)
export const useTheme = create((set) => ({
    theme: localStorage.getItem("preferred-theme") || "ASAS",
    setTheme: (theme) => {
        {/* localStorage funciona como cookies, podem ser acedidas numa altura posterior, mas nao sao muito seguras */}
        localStorage.setItem("preferred-theme", theme);
        set({theme});
    }
}));