import axios, { AxiosResponse } from "axios";

const accountIdentifier = process.env.ACCOUNT_ID as string;
const authEmail = process.env.ACCOUNT_EMAIL as string;
const authKey = process.env.API_TOKEN as string;
const zoneIdentifier = process.env.ZONE_ID as string;

// Define an interface for the response JSON structure
interface EmailRoutingAddress {
  tag: string;
  email: string;
  verified: string;
  created: string;
  modified: string;
}

interface EmailRoutingAddressesResponse {
  result: EmailRoutingAddress[];
  success: boolean;
  errors: string[];
  messages: string[];
}

export async function getEmailRoutingAddresses(): Promise<
  AxiosResponse<EmailRoutingAddressesResponse>
> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountIdentifier}/email/routing/addresses`;

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

interface CreateEmailRoutingAddressResult {
  created: string;
  email: string;
  modified: string;
  tag: string;
  verified: string;
}

interface CreateEmailRoutingAddressResponse {
  errors: string[];
  messages: string[];
  result: CreateEmailRoutingAddressResult;
  success: boolean;
}
export async function createEmailRoutingAddress(
  email: string
): Promise<AxiosResponse<CreateEmailRoutingAddressResponse>> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountIdentifier}/email/routing/addresses`;

  const headers = {
    "Content-Type": "application/json",
    "X-Auth-Email": authEmail,
    "X-Auth-Key": authKey,
  };

  const data = {
    email: email,
  };

  try {
    const response = await axios.post<CreateEmailRoutingAddressResponse>(
      url,
      data,
      { headers }
    );
    return response;
  } catch (error) {
    throw error;
  }
}

interface CreateCialabsEmailRuleResult {
  actions: { type: string; value: string[] }[];
  enabled: boolean;
  matchers: { field: string; type: string; value: string }[];
  name: string;
  priority: number;
  tag: string;
}

interface CreateCialabsEmailRuleResponse {
  result: CreateCialabsEmailRuleResult;
  success: boolean;
  errors: string[];
  messages: string[];
}

export async function createCialabsEmail(
  destinationEmail: string,
  matcherEmail: string
): Promise<AxiosResponse<CreateCialabsEmailRuleResponse>> {
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneIdentifier}/email/routing/rules`;

  const headers = {
    "Content-Type": "application/json",
    "X-Auth-Email": authEmail,
    "X-Auth-Key": authKey,
  };

  // Default ruleData based on your provided JSON
  const ruleData = {
    actions: [
      {
        type: "forward",
        value: [destinationEmail],
      },
    ],
    enabled: true,
    matchers: [
      {
        field: "to",
        type: "literal",
        value: matcherEmail,
      },
    ],
    name: "Send to user@example.net rule.",
    priority: 0,
  };

  try {
    const response = await axios.post<CreateCialabsEmailRuleResponse>(
      url,
      ruleData,
      { headers }
    );
    return response;
  } catch (error) {
    throw error;
  }
}
