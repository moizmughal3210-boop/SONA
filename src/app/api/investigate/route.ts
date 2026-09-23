import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");
    
    console.log("Received file:", audio);
    
    const backendForm = new FormData();
    backendForm.append(
      "audio", 
      audio as Blob,
      (audio as File).name
    );
    
    const response = await fetch(
      "http://127.0.0.1:8000/investigate",
      {
        method: "POST",
        body: backendForm,
      }
    );
    
    console.log("Backend status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log("Backend response:", data);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
