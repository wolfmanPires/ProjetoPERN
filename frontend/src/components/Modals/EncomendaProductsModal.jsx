import React from "react";
import { Package, ShoppingCart, X } from "lucide-react";
import { useAuthStore } from "../../constants/useAuthStore";

function EncomendaProductsModal() {
  const {encomendaProducts} = useAuthStore();

  const formatEuro = (valor) =>
    Number(valor || 0).toLocaleString("pt-PT", {
      style: "currency",
      currency: "EUR"
    });

  //Calcula o total dos produtos
  const totalEncomenda = encomendaProducts.reduce(
    (total, produto) => total + Number(produto.preco_unitario || 0)*Number(produto.quantidade || 0),0);

  return (
    <dialog id="encomendaProductsModal" className="modal">
      <div className="modal-box max-w-5xl">

        {/* Botão fechar */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">
            <X className="size-4"/>
          </button>
        </form>

        <h3 className="text-2xl font-semibold flex items-center gap-2 mb-6">
          <ShoppingCart className="size-6"/>
          Produtos da encomenda
        </h3>

        {encomendaProducts.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <Package className="size-14 text-base-content/30"/>
            <p className="mt-4 text-base-content/60">
              Esta encomenda não possui produtos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {encomendaProducts.map((produto) => (
              <div key={produto.id_products} className="card bg-base-200 shadow-sm">
                <div className="card-body">
                  <div className="grid grid-cols-[110px_1fr] gap-6">
                    {/* Imagem */}
                    <div>
                      {produto.image ? (
                        <img src={produto.image} alt={produto.name} className="w-28 h-28 rounded-lg object-cover"/>
                      ) : (
                        <div className="w-28 h-28 rounded-lg bg-base-300 flex items-center justify-center">
                          <Package className="size-10 text-base-content/40"/>
                        </div>
                      )}
                    </div>

                    {/* Dados */}
                    <div className="space-y-3">
                      <div>
                        <h2 className="text-xl font-bold">
                          {produto.name}
                        </h2> 
                        {produto.description && (
                          <p className="text-base-content/70 mt-2 whitespace-pre-wrap">
                            {produto.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-base-100 rounded-lg p-4">
                          <p className="text-sm text-base-content/60">
                            Preço unitário
                          </p>
                          <p className="font-bold text-lg">
                            {formatEuro(produto.preco_unitario)}€
                          </p>
                        </div>

                        <div className="bg-base-100 rounded-lg p-4">
                          <p className="text-sm text-base-content/60">
                            Quantidade
                          </p>
                          <p className="font-bold text-lg">
                            {produto.quantidade}
                          </p>
                        </div>

                        <div className="bg-base-100 rounded-lg p-4">
                          <p className="text-sm text-base-content/60">
                            Total
                          </p>
                          <p className="font-bold text-lg">
                            {formatEuro(Number(produto.preco_unitario)*Number(produto.quantidade))}
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-end">
              <span className="text-xl font-bold mr-4">
                  Total a pagar:
              </span>

              <span className="text-2xl font-bold text-primary mr-4">
                {formatEuro(totalEncomenda)}
              </span>
            </div>
          </div>
        )}

        {/* Botão fechar */}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-primary">
              Fechar
            </button>
          </form>
        </div>

        {/* Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>
            Fechar
          </button>
        </form>
      </div>
    </dialog>
  );
}

export default EncomendaProductsModal
