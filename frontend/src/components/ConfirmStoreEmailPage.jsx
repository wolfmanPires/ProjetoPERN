import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import apiWithCreds from "../constants/axiosWithCreds";

function ConfirmStoreEmailPage() {
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState("loading");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setEstado("error");
      setMensagem("O link não contém um token válido.");
      return;
    }

    const confirmar = async () => {
      try {
        const resp = await apiWithCreds.get(
          "/api/store-auth/confirm-email",
          {
            params: { token },
          }
        );

        setEstado("success");
        setMensagem(resp.data.message);
      } catch (err) {
        setEstado("error");
        setMensagem(
          err.response?.data?.message ||
            "Não foi possível confirmar a conta."
        );
      }
    };

    confirmar();
  }, [searchParams]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body items-center text-center">
          {estado === "loading" && (
            <>
              <span className="loading loading-spinner loading-lg" />
              <h1 className="card-title">A confirmar a conta...</h1>
            </>
          )}

          {estado === "success" && (
            <>
              <div className="text-5xl">✓</div>
              <h1 className="card-title text-success">
                Conta confirmada
              </h1>
              <p>{mensagem}</p>

              <Link to="/storeLogin" className="btn btn-primary mt-4">
                Iniciar sessão
              </Link>
            </>
          )}

          {estado === "error" && (
            <>
              <div className="text-5xl">!</div>
              <h1 className="card-title text-error">
                Confirmação falhou
              </h1>
              <p>{mensagem}</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default ConfirmStoreEmailPage;