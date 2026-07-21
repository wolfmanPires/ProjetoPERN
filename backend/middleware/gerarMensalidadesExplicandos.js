import pool from "../config/db.js"

export const gerarMensalidadesExplicandos = async () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const primeiroDiaMes = new Date(ano, mes, 1);
    const ultimoDiaMes = new Date(ano, mes + 1, 0);
    ultimoDiaMes.setHours(23, 59, 59, 0);

    //Procurar todos os explicandos com mensalidades definidas
    const explicandosResult = await pool.query(`
        SELECT id_explicando, id_utilizador, valor_mensalidade FROM explicando WHERE valor_mensalidade > 0
    `);

    //Para cada explicando, ao fim do mes inserir um pagamento de prestacao novo
    for (const explicando of explicandosResult.rows) {
        const valor = Number(explicando.valor_mensalidade).toFixed(2);
        await pool.query(`
            INSERT INTO pagamento (tipo, valor, is_receita, data_vencimento, data_pago, id_utilizador, mes_referencia)
            VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id_utilizador, mes_referencia, tipo)
            WHERE tipo = 'Mensalidade' DO NOTHING`,
            ["Mensalidade",valor,true,ultimoDiaMes,null,explicando.id_utilizador,primeiroDiaMes]);
    }
}