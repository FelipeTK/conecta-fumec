export function Monogram({ name }: { name: string }) {
  const letter = name.trim().charAt(0).toLocaleUpperCase("pt-BR");
  const tones = [
    "bg-blue-soft text-blue-ink",
    "bg-mist text-ink",
    "bg-[#e6f5ef] text-[#0e6b52]",
    "bg-[#fff6e5] text-[#8a5a00]",
  ];
  const index = [...name].reduce((total, char) => total + char.charCodeAt(0), 0) % tones.length;
  return (
    <span className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold ${tones[index]}`} aria-hidden="true">
      {letter || "?"}
    </span>
  );
}
