import { THEME } from "../config.js";

export const heading = (text) =>
  `<h1 style="margin:0 0 12px;color:${THEME.textPrimary};font-size:24px;font-weight:700;line-height:1.3;">${text}</h1>`;

export const subheading = (text) =>
  `<h2 style="margin:28px 0 12px;color:${THEME.primary};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">${text}</h2>`;

export const paragraph = (text, { muted = false, align = "left" } = {}) =>
  `<p style="margin:0 0 14px;color:${muted ? THEME.textSecondary : THEME.textPrimary};font-size:15px;line-height:1.6;text-align:${align};">${text}</p>`;

export const button = ({ label, href }) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px auto 8px;">
    <tr>
      <td align="center" style="border-radius:8px;background-color:${THEME.primary};">
        <a href="${href}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;letter-spacing:0.02em;">${label}</a>
      </td>
    </tr>
  </table>`;

export const divider = () =>
  `<hr style="border:none;border-top:1px solid ${THEME.border};margin:28px 0;" />`;

export const infoTable = (rows) => {
  const body = rows
    .filter((r) => r && r.value != null && r.value !== "")
    .map(
      (r) => `<tr>
        <td style="padding:12px 16px;border-bottom:1px solid ${THEME.border};color:${THEME.textSecondary};font-size:13px;font-weight:600;width:38%;vertical-align:top;">${r.label}</td>
        <td style="padding:12px 16px;border-bottom:1px solid ${THEME.border};color:${THEME.textPrimary};font-size:14px;vertical-align:top;">${r.value}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border:1px solid ${THEME.border};border-radius:10px;overflow:hidden;margin-bottom:8px;border-collapse:separate;">${body}</table>`;
};

const productRow = (it) => `<tr>
  <td style="padding:14px 12px;border-bottom:1px solid ${THEME.border};color:${THEME.textPrimary};font-size:13px;font-weight:500;">${it.name}</td>
  <td style="padding:14px 12px;border-bottom:1px solid ${THEME.border};color:${THEME.textSecondary};font-size:13px;text-align:center;">${it.size}</td>
  <td style="padding:14px 12px;border-bottom:1px solid ${THEME.border};color:${THEME.textSecondary};font-size:13px;text-align:center;">${it.quantity}</td>
  <td style="padding:14px 12px;border-bottom:1px solid ${THEME.border};color:${THEME.textSecondary};font-size:13px;text-align:right;white-space:nowrap;">${it.unitPrice}</td>
  <td style="padding:14px 12px;border-bottom:1px solid ${THEME.border};color:${THEME.textPrimary};font-size:13px;font-weight:700;text-align:right;white-space:nowrap;">${it.total}</td>
</tr>`;

const productHeaderCell = (label, align = "left") =>
  `<th style="padding:12px;background-color:${THEME.primary};color:${THEME.headerText};font-size:11px;font-weight:700;text-align:${align};text-transform:uppercase;letter-spacing:0.08em;">${label}</th>`;

export const productsTable = (items) => {
  const rows = items.map(productRow).join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid ${THEME.border};border-radius:10px;overflow:hidden;margin-bottom:8px;border-collapse:separate;">
    <thead>
      <tr>
        ${productHeaderCell("Producto", "left")}
        ${productHeaderCell("Talla", "center")}
        ${productHeaderCell("Cant.", "center")}
        ${productHeaderCell("P. Unit.", "right")}
        ${productHeaderCell("Total", "right")}
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
};

export const totalRow = (label, value) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:4px;">
    <tr>
      <td style="padding:14px 20px;text-align:right;color:${THEME.textSecondary};font-size:14px;font-weight:600;letter-spacing:0.02em;">${label}</td>
      <td style="padding:14px 20px;text-align:right;color:${THEME.primary};font-size:20px;font-weight:700;width:35%;white-space:nowrap;">${value}</td>
    </tr>
  </table>`;

export const quoteBox = (text) =>
  `<div style="background-color:${THEME.primaryLight};border-left:3px solid ${THEME.primary};padding:16px 20px;border-radius:6px;margin:12px 0 20px;color:${THEME.textPrimary};font-size:14px;line-height:1.6;">${text}</div>`;

export const productCard = ({ name, price, image, description }) => {
  const imageCell = image
    ? `<td width="84" style="padding:0 16px 0 0;vertical-align:middle;">
        <img src="${image}" alt="" width="84" height="84" style="display:block;width:84px;height:84px;object-fit:cover;border-radius:8px;border:1px solid ${THEME.border};" />
      </td>`
    : "";

  const priceBlock = price
    ? `<div style="color:${THEME.primary};font-size:16px;font-weight:700;">${price}</div>`
    : "";

  const descriptionBlock = description
    ? `<div style="color:${THEME.textSecondary};font-size:13px;line-height:1.5;margin-top:6px;">${description}</div>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border:1px solid ${THEME.border};border-radius:10px;overflow:hidden;margin-bottom:8px;">
    <tr>
      <td style="padding:16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            ${imageCell}
            <td style="vertical-align:middle;">
              <div style="color:${THEME.textPrimary};font-size:15px;font-weight:600;line-height:1.3;">${name}</div>
              ${priceBlock}
              ${descriptionBlock}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
};
