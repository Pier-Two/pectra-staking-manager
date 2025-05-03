import axios from "axios";
import { env } from "pec/env";

const hubspotApi = axios.create({
  baseURL: "https://gw-1.api.piertwo.io/integrations/hubspot",
  headers: {
    "api-key": env.HUBSPOT_API_KEY,
    "Content-Type": "application/json",
  },
});

export default hubspotApi;
