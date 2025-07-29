const getWelcomeEmailTemplate = (clientData) => {
  const { name, company, subscriptionRenewalDate, subscriptionAmount } =
    clientData;
  const currentYear = new Date().getFullYear();

  // Format the date to be more readable
  const formattedDate = new Date(subscriptionRenewalDate).toLocaleDateString(
    'es-ES',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return `
<!DOCTYPE html>
<html lang="es" style="margin: 0; padding: 0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Bienvenido</title>
  <style>
    body {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .header h1 {
      margin: 0;
      color: #333;
      font-size: 28px;
    }
    .content {
      margin-top: 30px;
      color: #444;
      line-height: 1.6;
    }
    .highlight {
      font-weight: bold;
      color: #2a9d8f;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 13px;
      color: #999;
    }
    .cta-button {
      display: inline-block;
      background-color: #2a9d8f;
      color: white;
      padding: 12px 24px;
      margin-top: 20px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>¡Bienvenido/a a nuestra plataforma, ${name}!</h1>
    </div>

    <div class="content">
      <p>Hola <span class="highlight">${name}</span>,</p>

      <p>¡Estamos encantados de tener a <strong>${company}</strong> con nosotros! Tu cuenta ha sido creada con éxito y estamos emocionados de que empieces a aprovechar todo lo que ofrecemos.</p>

      <p>🔔 Tu suscripción ha sido activada y se renovará el <span class="highlight">${formattedDate}</span> por un monto de <span class="highlight">$${subscriptionAmount}</span>.</p>

      <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.</p>

      <a href="https://tusitio.com/dashboard" class="cta-button">Ir al Panel</a>
    </div>

    <div class="footer">
      &copy; ${currentYear} Zabotech. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>
  `;
};

const passwordResetEmailTemplate = (resetData) => {
  const { name, resetLink } = resetData;
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recuperar contraseña</title>
  <style>
    body {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }
    .header h2 {
      margin: 0;
      color: #222;
    }
    .content {
      margin-top: 30px;
      color: #444;
      font-size: 16px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      background-color: #e63946;
      color: white;
      padding: 12px 24px;
      margin-top: 20px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 13px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Recuperación de Contraseña</h2>
    </div>

    <div class="content">
      <p>Hola ${name || 'Usuario'},</p>

      <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este mensaje.</p>

      <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>

      <a href="${resetLink}" class="button">Restablecer contraseña</a>

      <p>Este enlace expirará en 10 minutos.</p>

      <p>Si necesitas ayuda adicional, no dudes en contactarnos.</p>
    </div>

    <div class="footer">
      &copy; ${currentYear} Zabotech. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = { getWelcomeEmailTemplate, passwordResetEmailTemplate };
