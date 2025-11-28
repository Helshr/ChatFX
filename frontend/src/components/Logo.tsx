import logoImage from 'figma:asset/b9d10fa290992a1949471f48d0c77725d0d42ea7.png';

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img src={logoImage} alt="MG Studio Logo" className="h-8" />
      <span className="text-2xl tracking-tight text-gray-900">MG Studio</span>
    </div>
  );
}
