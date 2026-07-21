import React, { useMemo, useState } from 'react'
import { useAuthStore } from '../constants/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, ShoppingCart } from 'lucide-react';

function StoreCheckoutPage() {
  const { userStore, carrinho, carrinhoProducts, loading, closeCartDrawer, doPagamentoFromCarrinho } = useAuthStore();

  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  //Dados a enviar para o checkout
  const [dadosEnvio, setDadosEnvio] = useState({
    nome: userStore?.nome ?? "",
    email: userStore?.email ?? "",
    telemovel: userStore?.telemovel ?? "",
    observacoes: ""
  });

  //Calcular total a pagar pelo carrinho
  const subtotal = useMemo(() => {
    return carrinhoProducts.reduce(
      (total, product) => total + Number(product.price || 0) *Number(product.quantidade || 0), 0);
  }, [carrinhoProducts]);

  //Formata os valores monetarios para euros
  const formatEuro = (valor) =>
    Number(valor || 0).toLocaleString("pt-PT", {
      style: "currency",
      currency: "EUR"
  });

  //Trata de quando os dados mudam no checkout
  const handleChange = (campo, valor) => {
    setDadosEnvio((current) => ({
      ...current,
      [campo]: valor
    }));

    setError("");
  };

  //Opera todo o checkout
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!userStore) {
      navigate("/storeLogin");
      return;
    }

    if (!carrinho?.id_carrinho) {
      setError("Não foi possível identificar o carrinho.");
      return;
    }

    if (carrinhoProducts.length === 0) {
      setError("O carrinho está vazio.");
      return;
    }

    setSubmitting(true);
    setError("");

    //Abrir sessao para o checkout na Stripe
    const response = await doPagamentoFromCarrinho(dadosEnvio);

    if (response === null) {
      throw new Error("Ocorreu um erro no pagamento."); // "A Stripe não devolveu um endereço de pagamento."
    }

    closeCartDrawer();

      /*
      // Redirecionamento para a página alojada pela Stripe.
      window.location.href = response.data.url;
      */

    navigate(`/store/encomenda/${response.data.encomenda.id_encomenda}`,
      {
        replace: true,
        state: {
          encomenda: response.data.encomenda,
          criadaAgora: true
        }
      }
    );
  };

  //Caso o carrinho fique vazio (nao deve acontecer, pois volta para a loja, mas caso aconteca esta aqui)
  if (carrinhoProducts.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center py-16">
            <ShoppingCart className="size-14 text-base-content/40" />

            <h1 className="text-2xl font-bold">
              O carrinho está vazio
            </h1>

            <p className="text-base-content/60">
              Adiciona produtos antes de avançares para o checkout.
            </p>

            <Link to="/store" className="btn btn-primary mt-4">
              Voltar à loja
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/store" className="btn btn-ghost">
          <ArrowLeft className="size-4" />
          Continuar a comprar
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Finalizar encomenda
        </h1>

        <p className="text-base-content/60 mt-1">
          Confirma os produtos e os dados da encomenda para levantamento em loja.
        </p>
      </div>

      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">
          {/* Dados de entrega */}
          <section className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">
                <MapPin className="size-5" />
                Dados de entrega
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-2">
                    Nome completo
                  </span>

                  <input type="text" required className="input input-bordered w-full"
                    value={dadosEnvio.nome} onChange={(e) => handleChange("nome", e.target.value)}/>
                </label>

                <label className="form-control">
                  <span className="label-text mb-2">
                    Email
                  </span>

                  <input type="email" required className="input input-bordered w-full"
                    value={dadosEnvio.email} onChange={(e) => handleChange("email", e.target.value)}/>
                </label>

                <label className="form-control">
                  <span className="label-text mb-2">
                    Telemóvel
                  </span>

                  <input type="tel" required className="input input-bordered w-full"
                    value={dadosEnvio.telemovel} onChange={(e) => handleChange("telemovel", e.target.value)}/>
                </label>

                <label className="form-control md:col-span-2">
                  <span className="label-text mb-2">
                    Observações
                  </span>

                  <textarea className="textarea textarea-bordered w-full" placeholder="Informações adicionais para a entrega..."
                    value={dadosEnvio.observacoes} onChange={(e) => handleChange("observacoes", e.target.value)}/>
                </label>
              </div>
            </div>
          </section>

          {/* Produtos */}
          <section className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">
                Produtos
              </h2>

              <div className="divide-y divide-base-300">
                {carrinhoProducts.map((product) => (
                  <article key={product.id_products} className="grid grid-cols-[80px_1fr_auto] gap-4 items-center py-4">
                    <img src={product.image} alt={product.name} className="size-20 rounded-lg object-cover"/>

                    <div className="min-w-0">
                      <p className="font-semibold truncate">
                        {product.name}
                      </p>

                      <p className="text-sm text-base-content/60">
                        Quantidade: {product.quantidade}
                      </p>

                      <p className="text-sm">
                        {formatEuro(product.price)} por unidade
                      </p>
                    </div>

                    <p className="font-bold text-right">
                      {formatEuro(Number(product.price) *  Number(product.quantidade))}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Resumo */}
        <aside className="card bg-base-100 shadow-lg h-fit lg:sticky lg:top-[calc(var(--navbar-height)+1rem)]">
          <div className="card-body">
            <h2 className="card-title">
              Resumo da encomenda
            </h2>

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>{formatEuro(subtotal)}</span>
            </div>

            {error && (
              <div role="alert" className="alert alert-error mt-3">
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full mt-4" disabled={submitting || loading}>
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  A preparar pagamento...
                </>
              ) : (
                <>
                  <CreditCard className="size-5" />
                  Pagar Encomenda {/* com Stripe */} 
                </>
              )}
            </button>
            
            {/* 
            <p className="text-xs text-center text-base-content/50">
              O pagamento é processado de forma segura pela Stripe.
            </p>
             */}
            
          </div>
        </aside>
      </form>
    </main>
  )
}

export default StoreCheckoutPage
