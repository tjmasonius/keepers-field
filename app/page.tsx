import{redirect}from"next/navigation";
import{homePath}from"@/lib/core";
import{getStaff}from"@/lib/supabase/server";
export default async function Home(){const staff=await getStaff();redirect(homePath(staff.role));}
