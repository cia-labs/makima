import axios, { AxiosResponse } from "axios";

const accountIdentifier = process.env.ACCOUNT_ID as string;
const authEmail = process.env.ACCOUNT_EMAIL as string;
const authKey = process.env.API_TOKEN as string;
const zoneIdentifier = process.env.ZONE_ID as string;

interface EmailRoutingRule {
  actions: { type: string; value: string[] }[];
  enabled: boolean;
  matchers: {
    field: string;
    type: string;
    value: string;
  }[];
  name: string;
  priority: number;
}

interface EmailRoutingAddressesResponse {
  result: EmailRoutingRule[];
  success: boolean;
  errors: string[];
  messages: string[];
}
async function getEmailRoutingAddresses(): Promise<
  AxiosResponse<EmailRoutingAddressesResponse>
> {
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneIdentifier}/email/routing/rules`;

  const headers = {
    "Content-Type": "application/json",
    "X-Auth-Email": authEmail,
    "X-Auth-Key": authKey, // You might need an authentication key here, not included in the cURL command
  };

  try {
    const response = await axios.get<EmailRoutingAddressesResponse>(url, {
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

getEmailRoutingAddresses().then((res) => {
  console.log(
    res.data.result
      .map((e) => e.matchers.find((m) => m.field === "to")?.value)
      .filter((v) => v),
  );
});
