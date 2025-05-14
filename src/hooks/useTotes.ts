import { useEffect, useState } from "react";
import supabase from "../database/supabase";

export function useTotes() {
  const [totes, setTotes] = useState<any[] | null>();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("totes").select();
      setTotes(data);
    })();
  }, []);

  return { totes };
}
