import { Resend } from "resend";

//Tratar de mandar emails de confirmacao de registo para contas da loja
const resend = new Resend(process.env.RESEND_API_KEY);

//Manda e-mail de confirmacao de conta da loja
export async function enviarEmailConfirmacao({ email, nome, token }) {
	//Link de confirmacao
  const confirmationUrl =
    `${process.env.FRONTEND_URL}/store/confirmar-email?token=${encodeURIComponent(token)}`;

  //Escrita do email
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Confirma a tua conta na Loja ASAS",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Olá, ${escapeHtml(nome)}!</h2>

        <p>
          Foi criada uma conta na Loja ASAS com este endereço de email.
        </p>

        <p>
          Carrega no botão abaixo para confirmar a conta:
        </p>

        <p>
          <a
            href="${confirmationUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Confirmar conta
          </a>
        </p>

        <p>Este link expira dentro de 24 horas.</p>

        <p>
          Caso não tenhas criado esta conta, podes ignorar este email.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

//Manda e-mail para refazer a password da conta cujo esse e-mail esta associada
export async function enviarEmailRecuperacaoPassword({email,nome,token}) {
  const resetUrl =
    `${process.env.FRONTEND_URL}` +
    `/store/repor-password?token=${encodeURIComponent(token)}`;

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Alterar palavra-passe da Loja ASAS",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Olá, ${escapeHtml(nome)}!</h2>

        <p>
          Recebemos um pedido para alterar a palavra-passe da tua
          conta na Loja ASAS.
        </p>

        <p>
          Carrega no botão abaixo para escolheres uma nova palavra-passe:
        </p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Alterar palavra-passe
          </a>
        </p>

        <p>
          Este link expira dentro de uma hora e só pode ser utilizado
          uma vez.
        </p>

        <p>
          Caso não tenhas pedido esta alteração, podes ignorar este
          e-mail. A tua palavra-passe continuará igual.
        </p>
      </div>
    `
  });

  if (error) {
    throw new Error( error.message || "Não foi possível enviar o e-mail de recuperação.");
  }

  return data;
}

//Formatacao
function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}