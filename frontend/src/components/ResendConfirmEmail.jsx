import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, CircleAlert, CircleCheck, Mail, RefreshCw } from "lucide-react";
import apiWithCreds from "../constants/axiosWithCreds";

function ResendConfirmEmail() {
  const location = useLocation();

  const emailInicial =
    location.state?.email ||
    sessionStorage.getItem("emailConfirmacao") ||
    "";

  const [email, setEmail] = useState(emailInicial);
  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailTratado = email.trim().toLowerCase();

    setEstado("");
    setMensagem("");

    if (!emailTratado) {
      setEstado("error");
      setMensagem("Introduz o endereço de e-mail da tua conta.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiWithCreds.post(
        "/api/store-auth/reenviar-confirmacao",
        {
          email: emailTratado
        }
      );

      sessionStorage.setItem(
        "emailConfirmacao",
        emailTratado
      );

      setEstado("success");
      setMensagem(
        response.data?.message ||
          "Foi enviado um novo e-mail de confirmação."
      );
    } catch (error) {
      setEstado("error");
      setMensagem(
        error.response?.data?.message ||
          "Não foi possível reenviar o e-mail de confirmação."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body px-6 py-10 md:px-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-10 text-primary" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Reenviar e-mail de confirmação
            </h1>

            <p className="mt-2 text-base-content/70">
              Introduz o e-mail utilizado no registo para receberes um novo link de ativação.
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="form-control">
              <label htmlFor="email-confirmacao" className="label">
                <span className="label-text font-medium">
                  Endereço de e-mail
                </span>
              </label>

              <label className="input input-bordered flex items-center gap-3">
                <Mail className="size-5 text-base-content/50" />

                <input id="email-confirmacao" type="email" className="grow" placeholder="exemplo@email.pt" value={email} onChange={(e) => {
                    setEmail(e.target.value);
                    if (estado) {
                      setEstado("");
                      setMensagem("");
                    }
                  }}
                  autoComplete="email" disabled={loading} required/>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  A enviar...
                </>
              ) : (
                <>
                  <RefreshCw className="size-4" />
                  Reenviar e-mail
                </>
              )}
            </button>
          </form>

          <div className="divider">ou</div>

          <Link to="/storeLogin" className="btn btn-ghost w-full">
            <ArrowLeft className="size-4" />
            Voltar ao login
          </Link>

          <p className="mt-5 text-center text-xs text-base-content/50">
            Verifica também a pasta de spam ou correio não solicitado.
          </p>
        </div>
      </div>
    </main>
  );
}

export default ResendConfirmEmail
