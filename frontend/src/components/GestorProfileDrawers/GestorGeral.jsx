import React, { useEffect } from 'react'
import { CalendarDays, CreditCard, GraduationCap, Users, AlertTriangle, PlusCircle, SquarePen } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { doLogin } from '../../constants/loginRegister'
import { useAuth } from '../../constants/useAuth'
import { gestorAuth } from '../../constants/gestorAuth'
import { endOfWeek, isSameDay, isSameMonth, isSameWeek, startOfWeek } from 'date-fns'

function GestorGeral({mudarDrawer}) {
  const { loading, explicacoes, explicadores, explicandos, pagamentos, disciplinas, avalFuturas, getAllExplicacoes, getAllExplicadores, getAllExplicandos, getAllPagamentos, getAllDisciplinas, getAllAvalFuturas } = gestorAuth();
  const hoje = new Date()
  const navigate = useNavigate()
  const {logout} = doLogin()
  const {user} = useAuth()

  useEffect(() => {
    getAllExplicacoes();
    getAllExplicadores();
    getAllExplicandos();
    getAllPagamentos();
    getAllDisciplinas();
    getAllAvalFuturas();
  }, []);

  //Tratar do botao de logout
  const handleLogout = async () => {
    await logout()
    navigate("/userLogin")
  } 

  //Funcao que escreve introdução ao utilizador, dependente da hora do dia
  const greeting = () => {
    if(hoje.getHours()>=6 && hoje.getHours()<12){
      return `Bom dia ${user.nome}!`
    }else if(hoje.getHours()>=12 && hoje.getHours()<19){
      return `Boa tarde ${user.nome}!`
    }else{
      return `Boa noite ${user.nome}!`
    }
  }

  //Funcao de desenho para dinheiro
  const formatEuro = (valor) => Number(valor || 0).toLocaleString("pt-PT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  //Funcao para explicacoes do dia
  const explicacoesHoje = explicacoes.filter((exp) =>
    isSameDay(hoje,exp.data_inicio)
  );

  //Estatisticas para pagamentos
  const pagamentosMes = pagamentos.filter((pag) =>isSameMonth(hoje,pag.data_vencimento));
  const receitasMes = pagamentosMes.filter((pag) => pag.is_receita).reduce((total, pag) => total + Number(pag.valor || 0), 0);
  const despesasMes = pagamentosMes.filter((pag) => !pag.is_receita).reduce((total, pag) => total + Number(pag.valor || 0), 0);
  const pagamentosAtrasados = pagamentos.filter((pag) => {
    if (pag.data_pago) return false;
    return new Date(pag.data_vencimento) < hoje;
  });

  //Estatisticas para explicacoes por dar
  const explicacoesPendentes = explicacoes.filter((exp) => !exp.lecionada && new Date(exp.data_inicio) < hoje);

  //Estatisticas para avaliacoes futuras que ja passaram
  const avalFuturasPendentes = avalFuturas.filter((aval) => new Date(aval.data) < hoje)

  return (
    <div className='w-full'>
      {/* Barra de acolhimento / botao de logout */}
      <div className='shrink-0 w-full px-8 pt-4'>
        <div className='grid grid-cols-2 w-full mb-4 '>
          <h1 className='text-xl font-bold flex items-center'>
            Perfil de Gestão - {greeting()}
          </h1>

          {/* Botao de logout */}
          <div className='flex justify-end'>
            <button className='btn btn-error' onClick={handleLogout}>Terminar Sessão</button>
          </div>
        </div>
      </div>

      <div className='card bg-base-100 shadow-lg'>
        <div className='card-body'>
          <h2 className="text-2xl font-bold">Visão Geral</h2>

          {/* Estatisticas principais */}
          <div className="stats shadow w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <CalendarDays />
              </div>
              <div className="stat-title">Explicações</div>
              <div className="stat-value">{explicacoes.length}</div>
              <div className="stat-desc">{explicacoesHoje.length} hoje</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-primary">
                <GraduationCap />
              </div>
              <div className="stat-title">Explicadores</div>
              <div className="stat-value">{explicadores.length}</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-primary">
                <Users />
              </div>
              <div className="stat-title">Explicandos</div>
              <div className="stat-value">{explicandos.length}</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-primary">
                <SquarePen />
              </div>
              <div className="stat-title">Avaliações Futuras</div>
              <div className="stat-value">{avalFuturas.length}</div>
            </div>
          </div>

          {/* Financeiro */}
          <div className="stats shadow w-full">
            <div className="stat">
              <div className="stat-title">Receitas do mês</div>
              <div className="stat-value text-success">
                {formatEuro(receitasMes)}€
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Despesas do mês</div>
              <div className="stat-value text-error">
                {formatEuro(despesasMes)}€
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Balanço</div>
              <div className="stat-value text-primary">
                {formatEuro(receitasMes - despesasMes)}€
              </div>
            </div>
          </div>

          {/* Alertas */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">
                <AlertTriangle className="text-warning" />
                Alertas
              </h3>

              <div className="grid gap-3">
                <button className="alert alert-warning justify-start" onClick={() => mudarDrawer?.("pagamentos")}>
                  {pagamentosAtrasados.length} pagamentos em atraso
                </button>

                <button className="alert alert-info justify-start" onClick={() => mudarDrawer?.("explicacoes")}>
                  {explicacoesPendentes.length} explicações por marcar como lecionadas
                </button>

                <button className="alert alert-info justify-start" onClick={() => mudarDrawer?.("avalFuturas")}>
                  {avalFuturasPendentes.length} avaliações futuras de explicandos que já passaram
                </button>

              </div>
            </div>
          </div>

          {/* Explicacoes de hoje + acoes rapidas */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">Explicações de hoje</h3>

                {loading ? (
                  <span className="loading loading-spinner loading-md" />
                ) : explicacoesHoje.length === 0 ? (
                  <p className="text-base-content/60">
                    Não existem explicações agendadas para hoje.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <tbody>
                        {explicacoesHoje.slice(0, 6).map((exp) => (
                          <tr key={exp.id_explicacao}>
                            <td>{exp.disciplina_nome}</td>
                            <td>{exp.explicador_nome}</td>
                            <td>{exp.explicando_nome}</td>
                            <td>{exp.data_inicio?.slice(11, 16)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {explicacoesHoje.length > 6 && (
                  <button className="btn btn-sm btn-outline mt-2" onClick={() => mudarDrawer?.("explicacoes")}>
                    Ver todas
                  </button>
                )}
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">
                  <PlusCircle />
                  Ações rápidas
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button className="btn btn-primary" onClick={() => mudarDrawer?.("explicacoes")}>
                    Nova Explicação
                  </button>

                  <button className="btn btn-primary" onClick={() => mudarDrawer?.("pagamentos")}>
                    Novo Pagamento
                  </button>

                  <button className="btn btn-primary" onClick={() => mudarDrawer?.("explicadores")}>
                    Novo Explicador
                  </button>

                  <button className="btn btn-primary" onClick={() => mudarDrawer?.("explicandos")}>
                    Novo Explicando
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default GestorGeral
