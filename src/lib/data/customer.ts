import { sdk } from "@/lib/medusa";

export async function login(email: string, password: string) {
  const token = await sdk.auth.login("customer", "emailpass", {
    email,
    password,
  });

  return token;
}

export async function register(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) {
  const token = await sdk.auth.register("customer", "emailpass", {
    email: data.email,
    password: data.password,
  });

  const { customer } = await sdk.store.customer.create({
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
  });

  return { customer, token };
}

export async function getCustomer() {
  const { customer } = await sdk.store.customer.retrieve();
  return customer;
}

export async function logout() {
  await sdk.auth.logout();
}

export async function updateCustomer(data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  const { customer } = await sdk.store.customer.update(data);
  return customer;
}

export async function listAddresses() {
  const { addresses } = await sdk.store.customer.listAddress();
  return addresses;
}

export async function createAddress(data: {
  first_name: string;
  last_name: string;
  phone?: string;
  address_1: string;
  address_2?: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
}) {
  const { customer } = await sdk.store.customer.createAddress(data);
  return customer;
}

export async function updateAddress(
  addressId: string,
  data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    province?: string;
    postal_code?: string;
  }
) {
  const { customer } = await sdk.store.customer.updateAddress(addressId, data);
  return customer;
}

export async function deleteAddress(addressId: string) {
  await sdk.store.customer.deleteAddress(addressId);
}

export async function listOrders() {
  const { orders } = await sdk.store.order.list();
  return orders;
}

export async function requestPasswordReset(email: string) {
  await sdk.auth.resetPassword("customer", "emailpass", {
    identifier: email,
  });
}
