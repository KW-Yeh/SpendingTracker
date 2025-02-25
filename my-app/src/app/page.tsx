import { redirect, RedirectType } from 'next/navigation';

export default function Home() {
  redirect('/insert?quickInsert=true', RedirectType.replace);
}
