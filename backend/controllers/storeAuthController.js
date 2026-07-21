import argon2 from "argon2";
import crypto from "node:crypto";
import pool from "../config/db.js";
import { enviarEmailConfirmacao, enviarEmailRecuperacaoPassword } from "../middleware/emailService.js";

//Regista o utilizador na table do utilizador_compras como pendente e manda o e-mail de confirmacao
export const registarUtilizadorCompras = async (req, res) => {
  const { nome, email, password, telemovel } = req.body;

  if (!nome || !email || !password) {
    return res.status(400).json({
      message: "Nome, email e palavra-passe são obrigatórios.",
    });
  }

  const client = await pool.connect();

  try {
    const emailNormalizado = email.trim().toLowerCase();

    const utilizadorExistente = await client.query(
      `
        SELECT id_utilizador_compras, email_verificado
        FROM utilizador_compras
        WHERE LOWER(email) = $1
      `,
      [emailNormalizado]
    );

    if (utilizadorExistente.rows.length > 0) {
      return res.status(409).json({
        message: "Já existe uma conta com este email.",
      });
    }

    const passwordHash = await argon2.hash(password, {type: argon2.argon2id});

    // Token enviado ao cliente
    const token = crypto.randomBytes(32).toString("hex");

    // So o hash e guardado na base de dados
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    //Token de confirmacao de conta fica com 1 hora de validade
    //*1000 -> transforma milisegundos em segundos, *60 -> primeiro transforma segundos em minutos, segundo transforma minutos em 1 hora
    const tokenExpira = new Date(Date.now() + 24 * 60 * 60 * 1000);

    //Comecar query de SQL
    await client.query("BEGIN");

    const resultado = await client.query(
      `INSERT INTO utilizador_compras (nome, email, password_hash, telemovel, email_verificado, token_verificacao_hash, token_verificacao_expira)
        VALUES ($1, $2, $3, $4, FALSE, $5, $6) RETURNING id_utilizador_compras, nome, email`,
      [nome.trim(),emailNormalizado,passwordHash,telemovel || null,tokenHash,tokenExpira,]
    );

    await enviarEmailConfirmacao({
      email: emailNormalizado,
      nome: nome.trim(),
      token,
    });

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Conta criada. Consulta o teu email para confirmar o registo.",
      utilizador: resultado.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Erro ao registar utilizador da loja:", err);

    return res.status(500).json({
      message: "Não foi possível concluir o registo.",
    });
  } finally {
    client.release();
  }
};

//Apos confirmacao do email, trata de tornar a conta permanente
export const confirmarEmail = async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({
      message: "Token de confirmação inválido.",
    });
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resultado = await pool.query(
      `UPDATE utilizador_compras SET email_verificado = TRUE, token_verificacao_hash = NULL, token_verificacao_expira = NULL
        WHERE token_verificacao_hash = $1 AND token_verificacao_expira > CURRENT_TIMESTAMP AND email_verificado = FALSE
        RETURNING id_utilizador_compras, nome, email`,[tokenHash]
    );

    if (resultado.rows.length === 0) {
      return res.status(400).json({
        message:"O link de confirmação é inválido, já foi utilizado ou expirou.",
      });
    }

    return res.status(200).json({
      message: "Email confirmado com sucesso.",
      utilizador: resultado.rows[0],
    });
  } catch (err) {
    console.error("Erro ao confirmar email:", err);

    return res.status(500).json({
      message: "Não foi possível confirmar o email.",
    });
  }
};

//Re-enviar codigo de confirmacao caso falhou a anterior
export const reenviarConfirmacao = async (req, res) => {
  const email = req.body?.email?.trim().toLowerCase();

  if (!email) {
    return res.status(400).json({
      message: "O endereço de e-mail é obrigatório."
    });
  }

  try {
    const result = await pool.query(`SELECT id_utilizador_compras, nome, email, email_verificado FROM utilizador_compras WHERE LOWER(email) = $1 LIMIT 1`,[email]);

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: "Se existir uma conta por confirmar com esse e-mail, será enviado um novo link."
      });
    }

    const utilizador = result.rows[0];

    if (utilizador.email_verificado) {
      return res.status(400).json({
        message:
          "Esta conta já se encontra confirmada. Já podes iniciar sessão."
      });
    }

    const tokenConfirmacao = crypto.randomBytes(32).toString("hex");

    const tokenConfirmacaoHash = crypto.createHash("sha256").update(tokenConfirmacao).digest("hex");

    //Token de confirmacao de conta fica com 1 hora de validade
    //*1000 -> transforma milisegundos em segundos, *60 -> primeiro transforma segundos em minutos, segundo transforma minutos em 1 hora 
    const tokenExpira = new Date(
      Date.now() + 60 * 60 * 1000
    );

    await pool.query(
      `UPDATE utilizador_compras SET token_verificacao_hash = $1, token_verificacao_expira = $2 WHERE id_utilizador_compras = $3`,
      [tokenConfirmacaoHash, tokenExpira, utilizador.id_utilizador_compras]
    );

    const linkConfirmacao =
      `${process.env.FRONTEND_URL}` + `/store/confirmar-conta/${tokenConfirmacao}`;

    await enviarEmailConfirmacao({
      email: utilizador.email,
      nome: utilizador.nome,
      token,
    });

    return res.status(200).json({
      message: "Foi enviado um novo e-mail de confirmação. Verifica também a pasta de spam."
    });
  } catch (error) {
    console.error( "Erro ao reenviar confirmação:", error);

    return res.status(500).json({
      message: "Não foi possível reenviar o e-mail de confirmação."
    });
  }
};

//Trata do processo de renovar a password, para quando o utilizador de compras insere um e-mail com conta existente na BD
export const pedirRecuperacaoPassword = async (req, res) => {
  const email = req.body?.email?.trim().toLowerCase();

  if (!email) {
    return res.status(400).json({
      message: "O endereço de e-mail é obrigatório."
    });
  }

  try {
    const resultado = await pool.query(
      `SELECT id_utilizador_compras, nome, email, email_verificado
        FROM utilizador_compras WHERE LOWER(email) = $1 LIMIT 1`,[email]
    );

    if (resultado.rows.length === 0) {
      return res.status(200).json({
        message: "Se existir uma conta com esse e-mail, receberás uma mensagem com as instruções."
      });
    }

    const utilizador = resultado.rows[0];

    //Esta funcao serve para somente deixar contas com e-mails confirmados mudar password
    if (!utilizador.email_verificado) {
      return res.status(200).json({
        message: "Se existir uma conta com esse e-mail, receberás uma mensagem com as instruções."
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    //Token de recuperacao de conta fica com 1 hora de validade
    //*1000 -> transforma milisegundos em segundos, *60 -> primeiro transforma segundos em minutos, segundo transforma minutos em 1 hora 
    const tokenExpira = new Date(
      Date.now() + 60 * 60 * 1000
    );

    await pool.query(
      `UPDATE utilizador_compras SET token_recuperacao_password_hash = $1, token_recuperacao_password_expira = $2 WHERE id_utilizador_compras = $3`,
      [tokenHash,tokenExpira,utilizador.id_utilizador_compras]
    );

    try {
      await enviarEmailRecuperacaoPassword({
        email: utilizador.email,
        nome: utilizador.nome,
        token
      });
    } catch (err) {
      //Limpar tabela dos dados
      await pool.query(
        `UPDATE utilizador_compras SET token_recuperacao_password_hash = NULL, token_recuperacao_password_expira = NULL WHERE id_utilizador_compras = $1`,
        [utilizador.id_utilizador_compras]
      );

      throw err;
    }

    return res.status(200).json({
      message: "Se existir uma conta com esse e-mail, receberás uma mensagem com as instruções."
    });
  } catch (error) {
    console.error("Erro ao pedir recuperação de palavra-passe:",error);

    return res.status(500).json({
      message: "Não foi possível processar o pedido neste momento."
    });
  }
};

//Apos verificar que as palavras passes sao iguais, e o token de sessao de recuperacao nao expirou
export const reporPassword = async (req, res) => {
  const { token, password, confirmarPassword } = req.body;

  if (!token || typeof token !== "string") {
    return res.status(400).json({
      message: "O link de recuperação é inválido."
    });
  }

  if (!password || !confirmarPassword) {
    return res.status(400).json({
      message: "A nova palavra-passe e a confirmação são obrigatórias."
    });
  }

  if (password !== confirmarPassword) {
    return res.status(400).json({
      message: "As palavras-passe não coincidem."
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "A palavra-passe deve ter pelo menos 8 caracteres."
    });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const resultado = await client.query(
      `SELECT id_utilizador_compras FROM utilizador_compras WHERE token_recuperacao_password_hash = $1 AND token_recuperacao_password_expira > CURRENT_TIMESTAMP FOR UPDATE`,
      [tokenHash]
    );

    if (resultado.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "O link é inválido, já foi utilizado ou expirou."
      });
    }

    const utilizador = resultado.rows[0];

    const passwordHash = await argon2.hash(password,{type: argon2.argon2id});

    await client.query(
      `UPDATE utilizador_compras SET password_hash = $1, token_recuperacao_password_hash = NULL, token_recuperacao_password_expira = NULL
        WHERE id_utilizador_compras = $2`,
      [passwordHash,utilizador.id_utilizador_compras]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "A palavra-passe foi alterada com sucesso. Já podes iniciar sessão."
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Erro ao repor palavra-passe:",error);

    return res.status(500).json({
      message: "Não foi possível alterar a palavra-passe."
    });
  } finally {
    client.release();
  }
};