import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CircleAlert, CircleCheck, Mail, Send} from "lucide-react";
import logoLoja from "../assets/int-loja-BGless.png";
import apiWithCreds from "../constants/axiosWithCreds";

function StoreRecupPass() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState("");
  const [mensagem, setMensagem] = useState("");

  //Recebe os dados e manda o e-mail de confirmacao
  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailNormalizado = email.trim().toLowerCase();

    setEstado("");
    setMensagem("");

    if (!emailNormalizado) {
      setEstado("error");
      setMensagem("Introduz o endereço de e-mail da tua conta.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiWithCreds.post(
        "/api/store-auth/pedir-recuperacao-password",
        {
          email: emailNormalizado
        }
      );

      setEstado("success");
      setMensagem(response.data?.message || "Consulta o teu e-mail para continuares.");
    } catch (error) {
      setEstado("error");
      setMensagem(error.response?.data?.message || "Não foi possível processar o pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 px-4 py-8">
      <div className="mx-auto w-full max-w-lg">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body px-6 py-8 sm:px-10">
            <div className="flex justify-center">
              <img
                src={logoLoja}
                alt="Logótipo Loja ASAS"
                className="h-auto w-full max-w-xs object-contain"
              />
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold">
                Recuperar palavra-passe
              </h1>

              <p className="mt-2 text-base-content/70">
                Introduz o e-mail associado à tua conta. Caso esteja registado, receberás um link para criares uma nova palavra-passe.
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
                <label htmlFor="email-recuperacao" className="label">
                  <span className="label-text font-medium">
                    E-mail
                  </span>
                </label>

                <label className="input input-bordered flex items-center">
                  <Mail className="size-5 text-base-content/50" />

                  <input id="email-recuperacao" type="email" className="grow w-full" placeholder="exemplo@email.pt" autoComplete="email"
                    value={email} disabled={loading} required onChange={(event) => {
                      setEmail(event.target.value);
                      if (estado) {
                        setEstado("");
                        setMensagem("");
                      }
                    }}
                  />
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
                    <Send className="size-4" />
                    Enviar link de recuperação
                  </>
                )}
              </button>
            </form>

            <div className="divider">ou</div>

            <Link to="/storeLogin" className="btn btn-ghost w-full">
              <ArrowLeft className="size-4" />
              Voltar ao início de sessão
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default StoreRecupPass
