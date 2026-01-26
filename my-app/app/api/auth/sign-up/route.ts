import { NextRequest, NextResponse } from "next/server";
const res= NextResponse;
export async function POST(req:NextRequest) {
    
    const {name,email,password}=await req.json();
    return NextResponse.json({msg:name},{status:400});
    
    
    
}