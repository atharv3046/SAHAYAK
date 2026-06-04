async function test() {
  const res = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'assistant', content: 'hello' },
        { role: 'user', content: 'youtubr video chaiya' },
        { role: 'assistant', content: 'माफ़ करें, अभी सेवा उपलब्ध नहीं है। कृपया थोड़ी देर बाद प्रयास करें।' },
        { role: 'user', content: 'मुझे "youtubr video chaiya" को और सरल तरीके से समझाओ। कृपया एक भारतीय जीवन का उदाहरण दो।' }
      ]
    })
  });
  const text = await res.text();
  console.log(res.status, text);
}
test();
