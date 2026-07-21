import pool from "../config/db.js"

//Gerador de explicacoes que vao ser repetidas todo o mes, a mesma hora e mesmo dia da semana
export const gerarExplicacoesRecorrentes = async () => {
    try {
        //Procurar todas as explicacoes a repetir para o mes todo
        const RESULT = await pool.query(`SELECT * FROM explicacao WHERE repete_mensal = TRUE`);

        const modelos = RESULT.rows;

        const hoje = new Date();

        //Proximo mes
        const ano = hoje.getMonth() === 11 ? hoje.getFullYear() + 1 : hoje.getFullYear();

        const mes = hoje.getMonth() === 11 ? 0 : hoje.getMonth() + 1;

        for (const modelo of modelos) {
            const datas = gerarDatasDoMes(modelo.data_inicio,modelo.data_fim,ano,mes);

            for (const data of datas) {
                //Verificar se ja existe essa explicacao
                const existe = await pool.query(`SELECT id_explicacao FROM explicacao WHERE origem_recorrencia_id = $1 AND data_inicio = $2`,[modelo.id_explicacao,data.data_inicio]);
                
                if (existe.rows.length === 0) {
                    await pool.query(
                        `INSERT INTO explicacao(data_inicio,data_fim,lecionada,descricao,id_explicador,id_disciplina,id_explicando,repete_mensal,origem_recorrencia_id)
                          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                          [data.data_inicio,data.data_fim,false,modelo.descricao,modelo.id_explicador,modelo.id_disciplina,modelo.id_explicando,false,modelo.id_explicacao]
                    );
                }
            }
        }
    } catch (err) {
        console.error("Erro ao gerar explicações recorrentes:", err);
    }
};

//Funcao auxiliar para gerar os dias a implementar nas explicacoes
function gerarDatasDoMes(dataInicioOriginal, dataFimOriginal, ano, mes) {
    const inicio = new Date(dataInicioOriginal);
    const fim = new Date(dataFimOriginal);
    const diaSemana = inicio.getDay();
    const duracao = fim.getTime() - inicio.getTime();
    const datas = [];
    const dia = new Date(ano, mes, 1);

    //Cria todas as datas para todas as explicacoes que devem ser repercussivamente criadas
    while (dia.getMonth() === mes) {
        if (dia.getDay() === diaSemana) {
            const novoInicio = new Date(dia);
            novoInicio.setHours(inicio.getHours(),inicio.getMinutes(),0,0);

            const novoFim = new Date(novoInicio.getTime() + duracao);

            datas.push({
                data_inicio: novoInicio,
                data_fim: novoFim
            });
        }
        dia.setDate(dia.getDate() + 1);
    }

    return datas;
}