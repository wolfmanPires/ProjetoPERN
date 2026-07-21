import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, CreditCard, Package, ShoppingBag, Store } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../constants/useAuthStore";

function StoreEncomendaPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {userStore, clearCarrinho, getProdutosCarrinho, getEncomendaByID, getProdutosEncomenda} = useAuthStore();

  //resgatar encomenda acabada de criar sem ter de chamar de novo API
  const encomendaDoState = location.state?.encomenda ?? null;
  const criadaAgora = location.state?.criadaAgora === true;

  const [encomenda, setEncomenda] = useState(encomendaDoState);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(!encomendaDoState);
  const [error, setError] = useState("");

  useEffect(() => {
    //carregar encomenda em caso de falha do state da pagina anterior
    const carregarEncomenda = async () => {
      if (!id) {
        setError("Encomenda não identificada.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const responseEnc = await getEncomendaByID(id);
        const responseProd = await getProdutosEncomenda(id);

        setEncomenda(responseEnc);
        setProdutos(responseProd ?? []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Não foi possível carregar a encomenda."
        );
      } finally {
        setLoading(false);
      }
    };

    carregarEncomenda();
  }, [id]);

  //formatar dinheiro em euros
  const formatEuro = (valor) =>Number(valor || 0).toLocaleString("pt-PT", {
      style: "currency",
      currency: "EUR"
  });

  //desenhar as datas no formato europeu
  const formatData = (data) => {
    if (!data) return "—";

    return new Date(data).toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  //desenhar com icones o estado da encomenda
  const estadoClass = (estado) => {
    switch (estado) {
      case "concluida":
      case "levantada":
        return "badge-success";

      case "em_preparacao":
        return "badge-info";

      case "cancelada":
        return "badge-error";

      case "pronta":
      case "pronta_para_levantamento":
        return "badge-success";

      default:
        return "badge-warning";
    }
  };

  //desenhar com icones o estado do pagamento
  const estadoPagamentoClass = (estado) => {
    switch (estado) {
      case "pago":
        return "badge-success";

      case "falhado":
      case "cancelado":
        return "badge-error";

      default:
        return "badge-warning";
    }
  };

  //formatar strings do estado da encomenda pelo seu useState 
  const formatEstado = (estado) => {
    if (!estado) return "Desconhecido";

    return estado.replaceAll("_", " ").replace(/\b\w/g, (letra) => letra.toUpperCase());
  };

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg" />

          <p className="text-base-content/60">
            A carregar encomenda...
          </p>
        </div>
      </main>
    );
  }

  if (error || !encomenda) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center py-14">
            <Package className="size-14 text-error" />

            <h1 className="text-2xl font-bold">
              Encomenda não encontrada
            </h1>

            <p className="text-base-content/60">
              {error || "Não foi possível encontrar esta encomenda."}
            </p>

            <button type="button" className="btn btn-primary mt-4" onClick={() => navigate("/store/userPage")}>
              Voltar à minha conta
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/store/userPage" className="btn btn-ghost">
          <ArrowLeft className="size-4" />
          Voltar às encomendas
        </Link>
      </div>

      {criadaAgora && (
        <div role="alert" className="alert alert-success mb-6">
          <CheckCircle2 className="size-5" />
          <div>
            <h2 className="font-bold">
              Encomenda criada com sucesso
            </h2>

            <p className="text-sm">
              A encomenda foi registada e pode ser consultada nesta página.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          {/* Cabeçalho */}
          <section className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-base-content/60">
                    Encomenda
                  </p>

                  <h1 className="text-3xl font-bold">
                    #{encomenda.id_encomenda}
                  </h1>

                  <div className="flex items-center gap-2 mt-2 text-base-content/60">
                    <CalendarDays className="size-4" />

                    <span>
                      Criada em{" "}
                      {formatData(encomenda.data_encomenda)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`badge badge-lg ${estadoClass(encomenda.estado)}`}>
                    {formatEstado(encomenda.estado)}
                  </span>

                  <span className={`badge ${estadoPagamentoClass(encomenda.estado_pagamento)}`}>
                    Pagamento:{" "}
                    {formatEstado(encomenda.estado_pagamento)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Informação de levantamento */}
          <section className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">
                <Store className="size-5" />
                Levantamento em loja
              </h2>

              <div className="alert alert-info">
                <span>
                  Esta encomenda deverá ser levantada presencialmente na loja depois de ficar pronta.
                </span>
              </div>

              {encomenda.estado ===
                "pronta_para_levantamento" && (
                <div className="alert alert-success mt-3">
                  <CheckCircle2 className="size-5" />

                  <span>
                    A tua encomenda já está pronta para levantamento.
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Produtos */}
          <section className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">
                <ShoppingBag className="size-5" />
                Produtos
              </h2>

              {produtos.length === 0 ? (
                <p className="text-base-content/60 py-6 text-center">
                  Não foram encontrados produtos associados a esta encomenda.
                </p>
              ) : (
                <div className="divide-y divide-base-300">
                  {produtos.map((produto) => (
                    <article key={produto.id_encomenda_produto ?? produto.id_products} className="grid grid-cols-[72px_1fr_auto] gap-4 items-center py-4">
                      {produto.image ? (
                        <img src={produto.image} alt={produto.nome_produto} className="size-18 rounded-lg object-cover"/>
                      ) : (
                        <div className="size-18 rounded-lg bg-base-200 flex items-center justify-center">
                          <Package className="size-7 text-base-content/40" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {produto.nome_produto}
                        </p>

                        <p className="text-sm text-base-content/60">
                          Quantidade: {produto.quantidade}
                        </p>

                        <p className="text-sm">
                          {formatEuro(produto.preco_unitario)} por unidade
                        </p>
                      </div>

                      <p className="font-bold text-right">
                        {formatEuro(Number(produto.preco_unitario) *Number(produto.quantidade))}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Observações */}
          {encomenda.observacoes && (
            <section className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  Observações
                </h2>

                <p className="whitespace-pre-wrap">
                  {encomenda.observacoes}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Resumo lateral */}
        <aside className="card bg-base-100 shadow-lg h-fit lg:sticky lg:top-[calc(var(--navbar-height)+1rem)]">
          <div className="card-body">
            <h2 className="card-title">
              Resumo
            </h2>

            <div className="flex justify-between">
              <span>Produtos</span>

              <span>
                {encomenda.total}
              </span>
            </div>

            <div className="divider my-2" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>{formatEuro(encomenda.total)}</span>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-base-200">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="size-4" />

                <span className="font-semibold">
                  Pagamento
                </span>
              </div>

              <p className="text-sm text-base-content/70">
                Estado:{" "}{formatEstado(encomenda.estado_pagamento)}
              </p>

              {encomenda.data_pagamento && (
                <p className="text-sm text-base-content/70">
                  Pago em:{" "}{formatData(encomenda.data_pagamento)}
                </p>
              )}
            </div>

            {encomenda.estado_pagamento === "pendente" && (
              <div className="mt-4">
                <div className="alert alert-warning">
                  <Clock3 className="size-5" />

                  <span className="text-sm">
                    O pagamento desta encomenda ainda está pendente.
                  </span>
                </div>

                <button type="button" className="btn btn-primary w-full mt-3" disabled>
                  <CreditCard className="size-5" />
                  Pagamento disponível em breve
                </button>
              </div>
            )}

            <Link to="/store" className="btn btn-outline w-full mt-2">
              Continuar a comprar
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default StoreEncomendaPage
