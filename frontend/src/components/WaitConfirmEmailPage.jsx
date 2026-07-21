import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, CircleCheck, MailCheck, RefreshCw } from "lucide-react";

function WaitConfirmEmailPage() {
  const location = useLocation();

  const email = location.state?.email || "";

  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-xl bg-base-100 shadow-xl">
        <div className="card-body items-center text-center px-6 py-10 md:px-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
            <CircleCheck className="size-11 text-success" />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Conta criada com sucesso!
          </h1>

          <p className="mt-2 text-base-content/70">
            Enviámos um e-mail de confirmação para ativares a tua conta.
          </p>

          {email && (
            <div className="mt-4 rounded-lg bg-base-200 px-4 py-3">
              <p className="text-sm text-base-content/60">
                E-mail enviado para
              </p>
              <p className="font-semibold break-all">
                {email}
              </p>
            </div>
          )}

          <div className="alert mt-6 text-left">
            <MailCheck className="size-5 shrink-0" />
            <div>
              <p className="font-semibold">
                Verifica a tua caixa de entrada
              </p>
              <p className="text-sm">
                Abre o e-mail que recebeste e carrega no botão de
                confirmação para ativares a tua conta.
              </p>
            </div>
          </div>

          <div className="mt-6 w-full rounded-xl bg-base-200 p-5 text-left">
            <h2 className="font-semibold mb-3">
              Não encontraste o e-mail?
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/70">
              <li>
                Verifica a pasta de spam ou correio não solicitado.
              </li>
              <li>
                Confirma se o endereço de e-mail introduzido está correto.
              </li>
              <li>
                Aguarda alguns minutos, porque o envio pode sofrer um
                pequeno atraso.
              </li>
            </ul>
          </div>

          <div className="card-actions mt-7 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <Link to="/storeLogin" className="btn btn-outline">
              <ArrowLeft className="size-4" />
              Ir para o login
            </Link>

            <Link to="/store/reenviar-confirmacao" state={email} className="btn btn-primary">
              <RefreshCw className="size-4" />
              Reenviar e-mail
            </Link>
          </div>

          <p className="mt-5 text-xs text-base-content/50">
            Depois de confirmares a conta, já poderás iniciar sessão.
          </p>
        </div>
      </div>
    </main>
  );
}

export default WaitConfirmEmailPage
