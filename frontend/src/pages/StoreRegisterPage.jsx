import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeClosed, KeyRound, Mail, Phone, UserRound } from "lucide-react";
import logoLoja from "../assets/int-loja-BGless.png";
import BackButton from "../components/BackButton";
import apiWithCreds from "../constants/axiosWithCreds";

function StoreRegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telemovel: "",
    password: "",
    confirmPassword: "",
  });

  //Muda dados a usar no registo
  const handleChange = (campo, valor) => {
    setFormData((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor,
    }));

    setErro("");
  };

  //Trata do registo e impede se a password for fraca ou nao compativel uma com a outra
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErro("As palavras-passe não coincidem.");
      return;
    }

    if (formData.password.length < 8) {
      setErro("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      await apiWithCreds.post("/api/store-auth/register", {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        telemovel: formData.telemovel.trim() || null,
        password: formData.password,
      });

      navigate("/store/confirmacao-enviada", {
        state: {
          email: formData.email.trim().toLowerCase(),
        },
      });
    } catch (err) {
      setErro(
        err.response?.data?.message ||
          "Não foi possível criar a conta. Tenta novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <BackButton />

      {/* Logótipo */}
      <div className="flex justify-center mb-6">
        <img src={logoLoja} alt="Logótipo Loja ASAS" className="w-1/4" />
      </div>

      <div className="w-full max-w-xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Criar conta</h1>

          <p className="text-base-content/60 mt-2">
            Regista-te para acompanhares as tuas encomendas e compras.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Nome */}
          <div className="form-control">
            <div className="relative">
              <input type="text" placeholder="Nome completo" autoComplete="name" required className="input input-bordered w-full pl-10 py-3 focus:input-primary"
                value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)}/>

              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <UserRound className="size-5" />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="form-control">
            <div className="relative">
              <input type="email" placeholder="E-mail" autoComplete="email" required className="input input-bordered w-full pl-10 py-3 focus:input-primary" 
                value={formData.email} onChange={(e) => handleChange("email", e.target.value)}/>

              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Mail className="size-5" />
              </div>
            </div>
          </div>

          {/* Telemóvel */}
          <div className="form-control">
            <div className="relative">
              <input type="tel" placeholder="Telemóvel" autoComplete="tel" inputMode="numeric" className="input input-bordered w-full pl-10 py-3 focus:input-primary"
                value={formData.telemovel} onChange={(e) => handleChange("telemovel", e.target.value)}/>

              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Phone className="size-5" />
              </div>
            </div>
          </div>

          {/* Palavra-passe */}
          <div className="form-control">
            <div className="relative">
              <input type={passwordVisible ? "text" : "password"} placeholder="Palavra-passe" autoComplete="new-password" required minLength={8} className="input input-bordered w-full pl-10 pr-10 py-3 focus:input-primary"
                value={formData.password} onChange={(e) => handleChange("password", e.target.value)}/>

              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <KeyRound className="size-5" />
              </div>

              <button type="button" aria-label={passwordVisible ? "Esconder palavra-passe" : "Mostrar palavra-passe"}
                className="absolute inset-y-0 right-3 flex items-center text-base-content/50" onClick={() => setPasswordVisible((atual) => !atual)}>
                {passwordVisible ? (
                  <Eye className="size-5" />
                ) : (
                  <EyeClosed className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmar palavra-passe */}
          <div className="form-control">
            <div className="relative">
              <input type={confirmPasswordVisible ? "text" : "password"} placeholder="Confirmar palavra-passe" autoComplete="new-password" required minLength={8}
                className={`input input-bordered w-full pl-10 pr-10 py-3 focus:input-primary ${
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "input-error"
                    : ""
                }`}
                value={formData.confirmPassword} onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
              />

              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <KeyRound className="size-5" />
              </div>

              <button type="button" aria-label={confirmPasswordVisible ? "Esconder confirmação" : "Mostrar confirmação"} className="absolute inset-y-0 right-3 flex items-center text-base-content/50"
                onClick={() =>setConfirmPasswordVisible((atual) => !atual)}>
                {confirmPasswordVisible ? (
                  <Eye className="size-5" />
                ) : (
                  <EyeClosed className="size-5" />
                )}
              </button>
            </div>
          </div>

          {erro && (
            <div role="alert" className="alert alert-error">
              <span>{erro}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                A criar conta...
              </>
            ) : (
              "Criar conta"
            )}
          </button>

          <p className="text-center text-sm text-base-content/70">
            <Link to="/storeLogin" className="link link-primary font-medium">
              Já tens uma conta? Iniciar sessão
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default StoreRegisterPage;