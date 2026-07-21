import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircleAlert, CircleCheck, Eye, EyeOff, KeyRound, Save } from "lucide-react";
import logoLoja from "../assets/int-loja-BGless.png";
import apiWithCreds from "../constants/axiosWithCreds";

function StoreReporPass() {
  const [searchParams] = useSearchParams();

  const token = useMemo(
    () => searchParams.get("token") || "",
    [searchParams]
  );

  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] =
    useState("");

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [mostrarConfirmacao, setMostrarConfirmacao] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setEstado("");
    setMensagem("");

    if (!token) {
      setEstado("error");
      setMensagem("O link de recuperação é inválido.");
      return;
    }

    if (password.length < 8) {
      setEstado("error");
      setMensagem(
        "A palavra-passe deve ter pelo menos 8 caracteres."
      );
      return;
    }

    if (password !== confirmarPassword) {
      setEstado("error");
      setMensagem("As palavras-passe não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiWithCreds.post(
        "/api/store-auth/repor-password",
        {
          token,
          password,
          confirmarPassword
        }
      );

      setEstado("success");
      setMensagem(
        response.data?.message ||
          "A palavra-passe foi alterada com sucesso."
      );

      setPassword("");
      setConfirmarPassword("");
    } catch (error) {
      setEstado("error");
      setMensagem(
        error.response?.data?.message ||
          "Não foi possível alterar a palavra-passe."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-base-200 px-4 py-8">
        <div className="mx-auto max-w-lg">
          <div className="alert alert-error">
            <CircleAlert className="size-5" />

            <span>
              O link de recuperação não contém um token válido.
            </span>
          </div>

          <Link to="/store/pedir-recuperacao-password" className="btn btn-primary mt-5 w-full" >
            Pedir um novo link
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 px-4 py-8">
      <div className="mx-auto w-full max-w-lg">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body px-6 py-8 sm:px-10">
            <div className="flex justify-center">
              <img src={logoLoja} alt="Logótipo Loja ASAS" className="h-auto w-full max-w-xs object-contain" />
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold">
                Criar nova palavra-passe
              </h1>

              <p className="mt-2 text-base-content/70">
                Introduz e confirma a nova palavra-passe da tua conta.
              </p>
            </div>

            {estado === "success" && (
              <div className="alert alert-success mt-6">
                <CircleCheck className="size-5 shrink-0" />
                <span>{mensagem}</span>
              </div>
            )}

            {estado === "error" && (
              <div className="alert alert-error mt-6">
                <CircleAlert className="size-5 shrink-0" />
                <span>{mensagem}</span>
              </div>
            )}

            {estado !== "success" && (
              <form onSubmit={handleSubmit}className="mt-6 space-y-5">

                {/* Nova password */}
                <PasswordInput id="nova-password" label="Nova palavra-passe" value={password} setValue={setPassword} visivel={mostrarPassword} setVisivel={setMostrarPassword} autoComplete="new-password" />

                {/* Confirmar password */}
                <PasswordInput id="confirmar-password" label="Confirmar palavra-passe" value={confirmarPassword} setValue={setConfirmarPassword} visivel={mostrarConfirmacao} setVisivel={setMostrarConfirmacao} autoComplete="new-password" />

                <p className="text-sm text-base-content/60">
                  A palavra-passe deve ter pelo menos 8 caracteres.
                </p>

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      A alterar...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Alterar palavra-passe
                    </>
                  )}
                </button>
              </form>
            )}

            {estado === "success" && (
              <Link to="/storeLogin" className="btn btn-primary mt-5 w-full">
                Iniciar sessão
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

//Funcao auxiliar para ajudar a operar visibilidades das palavras passes e desenhar seus componentes
function PasswordInput({id,label,value,setValue,visivel,setVisivel,autoComplete}) {
  return (
    <div className="form-control">
      <label htmlFor={id} className="label">
        <span className="label-text font-medium">
          {label}
        </span>
      </label>

      <label className="input input-bordered flex items-center gap-3">
        <KeyRound className="size-5 shrink-0 text-base-content/50" />
        <input id={id} type={visivel ? "text" : "password"} className="grow min-w-0" value={value} autoComplete={autoComplete} minLength={8} required onChange={(event) => setValue(event.target.value)} />
        <button type="button" className="btn btn-ghost btn-xs btn-circle shrink-0"
          aria-label={visivel ? "Esconder palavra-passe" : "Mostrar palavra-passe"} onClick={() => setVisivel((estadoAtual) => !estadoAtual)}>
          {visivel ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </label>
    </div>
  );
}

export default StoreReporPass
