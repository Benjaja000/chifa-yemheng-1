export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <img
      src="/img/sello-yemheng.svg"
      alt="Sello Chifa Yemheng"
      width={size}
      height={size}
      className="rounded-full object-cover"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <span className="y-logo">
      <LogoMark size={size} />
      <span><span className="w">YEMHENG</span><span className="s">CHIFA TRADICIONAL</span></span>
    </span>
  );
}