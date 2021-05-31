export default function Lyrics({ lyrics }) {
  return (
    <div className="text-center h-100 lyrics d-flex flex-column">
        <p className="my-auto">{lyrics}</p>
    </div>
  );
}
