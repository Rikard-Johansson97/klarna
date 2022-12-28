import fetch from "node-fetch";

const getKlarnaAuth = () => {
  const username = process.env.PUBLIC_KEY;
  const password = process.env.SECRET_KEY;

  const auth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");

  return auth;
};

export const createOrder = async (product) => {
  const auth = getKlarnaAuth();
  const url = "https://api.playground.klarna.com/checkout/v3/orders";
  const headers = {
    Authorization: auth,
    "content-type": "application/json",
  };

  const quantity = 1;
  const price = product.price * 100;
  const total_amount = quantity * price;
  const total_tax_amount = total_amount * 0.2;

  const payload = {
    purchase_country: "SE",
    purchase_currency: "SEK",
    locale: "sv-SE",
    order_amount: total_amount,
    order_tax_amount: total_tax_amount,
    order_lines: [
      {
        type: "physical",
        reference: product.id,
        name: product.name,
        quantity,
        quantity_unit: "pcs",
        unit_price: price,
        tax_rate: 2500,
        total_amount: total_amount,
        total_discount_amount: 0,
        total_tax_amount,
      },
    ],
    merchant_urls: {
      terms: "https://www.example.com/terms.html",
      checkout:
        "https://www.example.com/checkout.html?order_id={checkout.order.id}",
      confirmation:
        process.env.REDIRECT_URL + "/confirmation?order_id={checkout.order.id}",
      push: "https://www.example.com/api/push?order_id={checkout.order.id}",
    },
  };

  const body = JSON.stringify(payload);
  const response = await fetch(url, {
    body: body,
    headers: headers,
    method: "POST",
  });
  const data = await response.json();

  return data;
};

export const retrieveOrder = async (order_id) => {
  const auth = getKlarnaAuth();
  const url =
    "https://api.playground.klarna.com/checkout/v3/orders/" + order_id;
  const headers = {
    Authorization: auth,
  };

  const response = await fetch(url, { headers: headers });
  const data = await response.json();
  return data;
};
