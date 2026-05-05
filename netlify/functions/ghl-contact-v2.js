exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const GHL_API_KEY = process.env.GHL_API_KEY;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
  const GHL_API_VERSION = process.env.GHL_API_VERSION || "2023-02-21";
  const GHL_API_URL = process.env.GHL_API_URL || "https://services.leadconnectorhq.com/contacts/upsert";

  if (!GHL_API_KEY) {
    return json(500, { error: "Missing GHL_API_KEY in Netlify environment variables." });
  }

  if (!GHL_LOCATION_ID) {
    return json(500, { error: "Missing GHL_LOCATION_ID in Netlify environment variables." });
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (error) {
    return json(400, { error: "Invalid JSON body." });
  }

  const fullName = clean(data.name);
  const nameParts = fullName.split(" ").filter(Boolean);
  const firstName = nameParts[0] || fullName || "Nouveau";
  const lastName = nameParts.slice(1).join(" ") || "Lead";

  const email = clean(data.email);
  const phone = clean(data.phone);

  if (!email && !phone) {
    return json(400, { error: "Email or phone is required to create a contact." });
  }

  const industry = clean(data.industry);
  const message = clean(data.message);
  const company = clean(data.company);

  const ghlPayload = {
    locationId: GHL_LOCATION_ID,
    firstName,
    lastName,
    name: fullName || `${firstName} ${lastName}`,
    email,
    phone,
    companyName: company,
    source: `Landing page LeadPilot${industry ? " | Secteur: " + industry : ""}${message ? " | Message: " + message : ""}`,
    tags: ["LeadPilot", "Audit demandé", "Landing page"]
  };

  try {
    const response = await fetch(GHL_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Version": GHL_API_VERSION,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(ghlPayload)
    });

    const responseText = await response.text();

    if (!response.ok) {
      return json(response.status, {
        error: "GoHighLevel API error",
        status: response.status,
        details: responseText
      });
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { raw: responseText };
    }

    return json(200, {
      success: true,
      crm: "GoHighLevel API v2",
      result
    });
  } catch (error) {
    return json(500, {
      error: "Server error while sending to GoHighLevel",
      details: error.message
    });
  }
};

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}
