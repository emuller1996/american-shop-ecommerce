import { BRAND, THEME } from "../config.js";

export function layout({ title, preheader = "", content }) {
  const websiteLabel = BRAND.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${THEME.background};font-family:'Helvetica Neue',Helvetica,Arial,'Segoe UI',sans-serif;color:${THEME.textPrimary};-webkit-font-smoothing:antialiased;">
    <span style="display:none!important;visibility:hidden;mso-hide:all;opacity:0;color:transparent;height:0;width:0;overflow:hidden;font-size:1px;line-height:1px;">${preheader}</span>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${THEME.background};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:${THEME.cardBackground};border-radius:12px;overflow:hidden;box-shadow:0 6px 24px rgba(20,20,40,0.08);">
            <tr>
              <td align="center" style="background-color:${THEME.primary};padding:36px 24px 28px;">
                <img src="${BRAND.logoUrl}" alt="${BRAND.name}" width="88" height="auto" style="display:block;margin:0 auto 14px;max-width:88px;height:auto;" />
                <div style="color:${THEME.headerText};font-size:18px;font-weight:700;letter-spacing:0.08em;">${BRAND.name.toUpperCase()}</div>
                <div style="color:rgba(255,255,255,0.88);font-size:12px;margin-top:4px;letter-spacing:0.04em;">${BRAND.tagline}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="background-color:${THEME.footerBg};padding:22px 24px;text-align:center;color:${THEME.textMuted};font-size:12px;line-height:1.6;">
                <div style="margin-bottom:6px;">© ${BRAND.year} ${BRAND.name} · Powered by MullerDev</div>
                <a href="${BRAND.websiteUrl}" style="color:${THEME.primary};text-decoration:none;font-weight:600;">${websiteLabel}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
