import cron from 'node-cron'
import { gerarExplicacoesRecorrentes } from './explicacoesRecorrentes.js'
import { gerarSalariosMensais } from './gerarSalariosMensais.js'
import { gerarMensalidadesExplicandos } from './gerarMensalidadesExplicandos.js';

async function executarTarefa(nome, tarefa) {
    console.log(`[CRON] ${nome}`);

    try {
        const inicio = Date.now();
        await tarefa();
        const tempo = ((Date.now() - inicio) / 1000).toFixed(2);
        console.log(`[CRON] ${nome} concluído com sucesso (${tempo} s).`);
    } catch (err) {
        console.error(`[CRON] Erro em "${nome}":`);
        console.error(err);
    }
}

//Codigo de cronometragem responsavel por criar explicacoes recorrentes de forma automatizada
//"0 3 * * *" -> 0 minutos, as 3 horas, * todos os dias do mes, * todos os meses, * todos os dias da semana
cron.schedule("0 3 * * *", async () => {
    await executarTarefa("Gerar Explicações Recorrentes", gerarExplicacoesRecorrentes)
})

//Codigo de cronometragem responsavel por criar pagamentos ao fim do mes para os explicadores
//"55 23 28-31 * *" -> Aos 55 minutos, 23 horas, dias 21 a 31 do mes, * todos os meses, * todos os dias da semana
cron.schedule("55 23 21-31 * *", async () => {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const ultimoDiaDoMes =
        amanha.getMonth() !== hoje.getMonth();
    if (!ultimoDiaDoMes)
        return;
    await executarTarefa("Gerar Salários Mensais", gerarSalariosMensais)
});

//Codigo de cronometragem responsavel por criar pagamentos das mensalidades dos explicandos ao fim do mes
//"55 23 28-31 * *" -> Aos 55 minutos, 23 horas, dias 21 a 31 do mes, * todos os meses, * todos os dias da semana
cron.schedule("55 23 21-31 * *", async () => {
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  if (amanha.getMonth() !== hoje.getMonth()) return;

  await executarTarefa("Gerar Mensalidades dos Explicandos", gerarMensalidadesExplicandos);
});