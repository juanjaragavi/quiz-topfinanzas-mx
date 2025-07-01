"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  appendUTMParamsToUrl,
  getUTMParamsFromCookies,
} from "@/lib/utm-cookie-manager";

const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

interface FormData {
  preference: string;
  income: string;
  email: string;
  name: string;
  lastName: string;
  receiveMessages: boolean;
}

export async function submitQuiz1(formData: FormData) {
  console.log("Quiz 1 submitted with data:", formData);

  try {
    // Add user to ConvertKit subscriber list
    await addConvertKitSubscriber(formData, "quiz1");
    console.log("User successfully added to ConvertKit for Quiz 1");
  } catch (error) {
    console.error("Failed to add user to ConvertKit for Quiz 1:", error);
    // Continue with the flow even if ConvertKit fails
  }

  const cookieStore = await cookies();
  cookieStore.set("quiz1_completed", "true", {
    path: "/",
    maxAge: THIRTY_DAYS_IN_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "lax",
  });

  // Append UTM parameters from cookies to the redirect URL
  const baseUrl =
    "https://topfinanzas.com/mx/recomendador-de-tarjetas-de-credito-p1/";
  const finalUrl = await appendUTMParamsToUrl(baseUrl);

  console.log("Quiz 1 redirect URL with UTM params:", finalUrl);
  redirect(finalUrl);
}

export async function submitQuiz2(formData: FormData) {
  console.log("Quiz 2 submitted with data:", formData);

  try {
    // Add user to ConvertKit subscriber list
    await addConvertKitSubscriber(formData, "quiz2");
    console.log("User successfully added to ConvertKit for Quiz 2");
  } catch (error) {
    console.error("Failed to add user to ConvertKit for Quiz 2:", error);
    // Continue with the flow even if ConvertKit fails
  }

  const cookieStore = await cookies();
  cookieStore.set("quiz2_completed", "true", {
    path: "/",
    maxAge: THIRTY_DAYS_IN_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "lax",
  });

  // Append UTM parameters from cookies to the redirect URL
  const baseUrl =
    "https://topfinanzas.com/mx/soluciones-financieras/guia-tarjeta-de-credito-nu-bank/";
  const finalUrl = await appendUTMParamsToUrl(baseUrl);

  console.log("Quiz 2 redirect URL with UTM params:", finalUrl);
  redirect(finalUrl);
}

export async function redirectToFinalQuiz1Destination() {
  // This action redirects a user who is already registered and has completed steps 1 and 2.
  // It mirrors the redirection logic that was previously in app/page.tsx,
  // including UTM parameter handling from cookies.

  // Use the appendUTMParamsToUrl utility for consistency
  const baseUrl =
    "https://topfinanzas.com/mx/recomendador-de-tarjetas-de-credito-p1/";
  const finalUrl = await appendUTMParamsToUrl(baseUrl);

  console.log("Registered user redirect URL with UTM params:", finalUrl);
  redirect(finalUrl);
}

export async function redirectToFinalQuiz2Destination() {
  // This action redirects a user who is already registered and has completed steps 1 and 2 for quiz 2.
  // It includes UTM parameter handling from cookies.

  // Use the appendUTMParamsToUrl utility for consistency
  const baseUrl =
    "https://topfinanzas.com/mx/soluciones-financieras/guia-tarjeta-de-credito-nu-bank/";
  const finalUrl = await appendUTMParamsToUrl(baseUrl);

  console.log("Quiz 2 registered user redirect URL with UTM params:", finalUrl);
  redirect(finalUrl);
}

/**
 * Add user as subscriber to ConvertKit list
 * Maps form data and UTM parameters to ConvertKit API format
 */
export async function addConvertKitSubscriber(
  formData: FormData,
  quizType: "quiz1" | "quiz2"
) {
  try {
    // Get UTM parameters from cookies
    const utmParams = await getUTMParamsFromCookies();

    // Map preference values to readable text
    const preferenceMap: Record<string, string> = {
      A: "Cupo de crédito alto",
      B: "Crédito inmediato",
      C: "Sin revisión de buró",
      D: "Sin anualidad",
      E: "Millas aéreas y puntos",
      F: "Cashback",
    };

    // Map income values to readable text
    const incomeMap: Record<string, string> = {
      A: "Entre $0 MXN y $7,500 MXN",
      B: "Entre $7,500 MXN y $15,000 MXN",
      C: "Entre $15,000 MXN y $30,000 MXN",
      D: "Entre $30,000 MXN y $45,000 MXN",
      E: "Entre $45,000 MXN y $60,000 MXN",
      F: "Más de $60,000 MXN",
    };

    // Create current date in the required format
    const currentDate = new Date()
      .toLocaleString("sv-SE", {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace("T", " ");

    // Build the payload for ConvertKit API
    const payload = {
      first_name: formData.name,
      email_address: formData.email,
      state: "active",
      fields: {
        acepto_politicas_de_tratamiento_de_datos_y_terminos_y_condiciones:
          formData.receiveMessages ? "1" : "0",
        beneficio_empresa: null,
        contacto: null,
        cual_es_tu_ingreso_mensual:
          incomeMap[formData.income] || formData.income,
        cuanto_dinero_necesitas: null,
        date_created: currentDate,
        describe_tu_necesidad: null,
        elige_el_grupo_que_mejor_describe_tu_situacion_actual: null,
        estas_reportado_en_buro_de_credito: null,
        flujo_prestamos_2: null,
        last_name: formData.lastName,
        monto_empresa: null,
        newsletter: null,
        pais: "Mexico",
        phone_number: null,
        preferencia_1_cupo_de_credito_alto:
          formData.preference === "A" ? "1" : null,
        preferencia_2_sin_buro: formData.preference === "C" ? "1" : null,
        preferencia_3_millas_y_puntos: formData.preference === "E" ? "1" : null,
        preferencia_4_credito_inmediato:
          formData.preference === "B" ? "1" : null,
        preferencia_5_sin_anualidad: formData.preference === "D" ? "1" : null,
        preferencia_6_cashback: formData.preference === "F" ? "1" : null,
        que_es_lo_que_mas_importante_en_una_tarjeta_de_credito:
          preferenceMap[formData.preference] || formData.preference,
        quickemailverification_free: null,
        quickemailverification_result: null,
        quickemailverification_safe_to_send: null,
        quiz_campana_leads: "SI",
        quiz_prestamos: null,
        quiz_prestamos_2: null,
        quiz_prestamos_bbva: null,
        quiz_prestamos_credilikeme: null,
        quiz_prestamos_discover: null,
        quiz_prestamos_empresarial_sabadell: null,
        quiz_prestamos_upstart: null,
        quiz_prestamo_kueski: null,
        quiz_tarjetas: quizType === "quiz1" ? "SI" : null,
        quiz_tarjeta_bbva_azul: null,
        quiz_tarjeta_citi_double_cash: null,
        quiz_tarjeta_hsbc_zero: null,
        quiz_tarjeta_nubank: quizType === "quiz2" ? "SI" : null,
        quiz_tarjeta_nubank_2: null,
        quiz_tarjeta_platacard: null,
        quiz_tarjeta_stori: null,
        quiz_tarjeta_visa_signature: null,
        recovery: null,
        reingresar_flujo_tarjetas: null,
        tarjetas_neobancos: null,
        utm_adgroup: utmParams.get("utm_adgroup") || "utm_adgroup",
        utm_campaign: utmParams.get("utm_campaign") || "22188538750",
        utm_content: utmParams.get("utm_content") || "172989200783",
        utm_medium: utmParams.get("utm_medium") || "cpc",
        utm_source: utmParams.get("utm_source") || "adwords",
        utm_term: utmParams.get("utm_term") || "utm_term",
      },
    };

    console.log("ConvertKit payload:", JSON.stringify(payload, null, 2));

    // Make the API request to ConvertKit
    const response = await fetch(process.env.KIT_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": process.env.KIT_API_KEY!,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ConvertKit API error:", response.status, errorText);
      throw new Error(`ConvertKit API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("ConvertKit subscriber added successfully:", result);

    return result;
  } catch (error) {
    console.error("Failed to add ConvertKit subscriber:", error);
    throw error;
  }
}
