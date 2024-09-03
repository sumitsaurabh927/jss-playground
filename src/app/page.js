"use client";

import { useEffect, useState } from 'react';
import { JigsawStack } from 'jigsawstack';

export default function Home() {
  const [data, setData] = useState(null);

  // console.log(process.env.NEXT_PUBLIC_JIGSAWSTACK_API_KEY); // ofc, next requires a prefix!

  useEffect(() => {
    const fetchData = async () => {
      const jigsawstack = JigsawStack({
        apiKey: process.env.NEXT_PUBLIC_JIGSAWSTACK_API_KEY, // key from env
      });

      const resp = await jigsawstack.web.ai_scrape({
        url: "https://www.amazon.com/Cadbury-Mini-Caramel-Eggs-Bulk/dp/B0CWM99G5W",
        element_prompts: ["prices"],
      });

      setData(resp);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>JigsawStack Integration</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}