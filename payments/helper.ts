export function formatPrice(price: string | undefined): string {
  if (!price) return "";
  return price.replace(/\.00$/, "");
}

export function priceWithCurrency(amount: number, currency: string, locale: string = "en-US") {
  let price = amount === 0 ? amount : amount / 100;
  const formattedPrice = new Intl.NumberFormat(locale, { style: "currency", currency }).format(price);
  return formatPrice(formattedPrice);
}

export const getReturnURL = (provider: string, params: any = {}) => {
  const url = window.location.href;
  const hasQueryParam = url.includes("?");
  return `${url}${hasQueryParam ? "&" : "?"}provider=${provider}${
    Object.keys(params).length > 0
      ? `&${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : ""
  }`;
};
