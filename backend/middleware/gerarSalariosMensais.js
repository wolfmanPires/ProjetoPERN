import pool from "../config/db.js";

const formatSQLDate = (date) => {return date.toISOString().slice(0,19).replace("T"," ")};

//Funcao que ao fim de um mes ve as horas que um explicador fez e cria o pagamento para este
export const gerarSalariosMensais = async () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const primeiroDiaMes = new Date(ano, mes, 1);
  const primeiroDiaProximoMes = new Date(ano, mes + 1, 1);
  const ultimoDiaMes = new Date(ano, mes + 1, 0);

  const explicadoresResult = await pool.query(`SELECT id_explicador, id_utilizador, valor_hora FROM explicador`);

  for (const explicador of explicadoresResult.rows) {
    //COALESCE recebe varios dados em grupo, e retorna o primeiro grupo de dados que nao sao nulos
    //EPOCH e como PostgreSQL representa espacos de tempo em segundos, entre 2 pontos no tempo diferentes (dai termos de fazer '/3600' para obter as horas)
    const horasResult = await pool.query(
      `SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (data_fim - data_inicio)) / 3600),0) 
      AS horas FROM explicacao WHERE id_explicador = $1 AND lecionada = TRUE AND data_inicio >= $2 AND data_inicio < $3`,
      [explicador.id_explicador,primeiroDiaMes,primeiroDiaProximoMes]
    );   

    //Dados auxiliares de calculo do pagamento
    const horas = Number(horasResult.rows[0].horas) || 0;
    const valorHora = Number(explicador.valor_hora) || 0;
    const salario = Number((horas * valorHora).toFixed(2));

    //Caso valor 0, saltar a frente
    if (salario <= 0) continue;

    await pool.query(`INSERT INTO pagamento ( tipo, valor, is_receita, data_vencimento, data_pago, id_utilizador, mes_referencia) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id_utilizador, mes_referencia, tipo) WHERE tipo = 'Salário' DO NOTHING`,
      ["Salário",salario,false,formatSQLDate(ultimoDiaMes),null,explicador.id_utilizador,formatSQLDate(primeiroDiaMes)]
    );
  }
}