import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container empty-state">
      <h1>That page has moved on.</h1>
      <p>Let’s get you back to the collection.</p>
      <Link href="/shop" className="button primary">
        Explore products
      </Link>
    </div>
  );
}
